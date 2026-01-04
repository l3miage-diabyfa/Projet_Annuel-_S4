import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ValidateCheckoutDto } from './dto/validate-checkout.dto';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import Stripe from 'stripe';

@Injectable()
export class SubscriptionService {
  private stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const stripeKey = process.env.STRIPE_SECRET_KEY || this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
    }
    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2025-12-15.clover',
    });
  }

  /**
   * Validates if the user can proceed to checkout with the selected number of classes
   * Returns the current class count and validates against the new numberOfClasses
   */
  async validateCheckout(userId: string, dto: ValidateCheckoutDto) {
    const { numberOfClasses } = dto;

    // Get user with establishment to count classes
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        establishment: {
          include: {
            users: {
              include: {
                classes: {
                  where: { isActive: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Utilisateur non trouvé');
    }

    // Count total active classes in the establishment
    const currentClassCount = user.establishment.users.reduce(
      (total, u) => total + u.classes.length,
      0
    );

    // Validate: numberOfClasses must be >= currentClassCount
    if (numberOfClasses < currentClassCount) {
      throw new BadRequestException(
        `Vous avez actuellement ${currentClassCount} classe${currentClassCount > 1 ? 's' : ''} active${currentClassCount > 1 ? 's' : ''}. ` +
        `Veuillez choisir au moins ${currentClassCount} classe${currentClassCount > 1 ? 's' : ''} ou supprimer des classes avant de continuer.`
      );
    }

    return {
      valid: true,
      currentClassCount,
      selectedClassCount: numberOfClasses,
      message: 'Validation réussie',
    };
  }

  /**
   * Calculate pricing for a subscription
   */
  calculatePrice(numberOfClasses: number, isAnnual: boolean): number {
    const monthlyPricePerClass = isAnnual ? 17 : 22;
    const monthlyTotal = numberOfClasses * monthlyPricePerClass;
    
    if (isAnnual) {
      return monthlyTotal * 12; // Annual total
    }
    
    return monthlyTotal;
  }

  /**
   * Creates a Stripe Checkout Session for Premium subscription
   */
  async createCheckoutSession(userId: string, dto: CreateCheckoutSessionDto) {
    const { numberOfClasses, isAnnual } = dto;

    // Get user and establishment info
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        establishment: true,
      },
    });

    if (!user || !user.establishment) {
      throw new BadRequestException('Utilisateur ou établissement non trouvé');
    }

    // Calculate price in cents for Stripe (euros * 100)
    const totalPrice = this.calculatePrice(numberOfClasses, isAnnual);
    const amountInCents = Math.round(totalPrice * 100);

    // Determine interval for Stripe
    const interval = isAnnual ? 'year' : 'month';

    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        customer_email: user.email,
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `Plan Premium - ${numberOfClasses} classe${numberOfClasses > 1 ? 's' : ''}`,
                description: `Abonnement ${isAnnual ? 'annuel' : 'mensuel'} pour ${numberOfClasses} classe${numberOfClasses > 1 ? 's' : ''}`,
              },
              unit_amount: amountInCents,
              recurring: {
                interval,
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId: user.id,
          establishmentId: user.establishment.id,
          numberOfClasses: numberOfClasses.toString(),
          isAnnual: isAnnual.toString(),
        },
        success_url: `${this.configService.get<string>('FRONTEND_URL')}/dashboard/pricing/confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.configService.get<string>('FRONTEND_URL')}/dashboard/pricing/checkout?canceled=true`,
      });

      return {
        sessionId: session.id,
        url: session.url,
      };
    } catch (error) {
      throw new BadRequestException(`Erreur lors de la création de la session Stripe: ${error.message}`);
    }
  }

  /**
   * Handles Stripe webhook events
   */
  async handleStripeWebhook(signature: string, rawBody: Buffer) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
      throw new BadRequestException('STRIPE_WEBHOOK_SECRET is not configured');
    }

    let event: Stripe.Event;

    try {
      // Verify webhook signature
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
    } catch (err) {
      throw new BadRequestException(`Webhook signature verification failed: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await this.handleCheckoutSessionCompleted(session);
        break;

      case 'customer.subscription.updated':
        // Handle subscription updates (e.g., payment failed, renewed)
        console.log('Subscription updated:', event.data.object);
        break;

      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        console.log('Subscription deleted:', event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }

  /**
   * Handle successful checkout completion
   */
  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const metadata = session.metadata || {};
    const { userId, establishmentId, numberOfClasses, isAnnual } = metadata as {
      userId?: string;
      establishmentId?: string;
      numberOfClasses?: string;
      isAnnual?: string;
    };

    if (!userId || !establishmentId || !numberOfClasses || !isAnnual) {
      console.error('Missing metadata in checkout session:', session.id);
      return;
    }

    // Get the subscription from Stripe
    const stripeSubscriptionId = session.subscription as string;
    const stripeSubscription = await this.stripe.subscriptions.retrieve(stripeSubscriptionId);

    // Extract current_period_end from subscription items (it's in items.data[0].current_period_end)
    const subscriptionData = stripeSubscription as any;
    const currentPeriodEnd = subscriptionData.items?.data?.[0]?.current_period_end;
    
    if (!currentPeriodEnd) {
      console.error('Current_period_end is missing from Stripe subscription items');
      throw new Error('Invalid subscription data from Stripe');
    }

    // Create subscription in database
    const subscription = await this.prisma.subscription.create({
      data: {
        planType: 'PREMIUM',
        status: 'ACTIVE',
        numberOfClasses: parseInt(numberOfClasses),
        isAnnual: isAnnual === 'true',
        stripeSubscriptionId,
        stripeCustomerId: session.customer as string,
        stripePriceId: stripeSubscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(currentPeriodEnd * 1000),
      },
    });

    // Update user's subscriptionId
    await this.prisma.user.update({
      where: { id: userId },
      data: { subscriptionId: subscription.id },
    });

    // Get invoice details from Stripe
    let invoiceUrl: string | null = null;
    let invoiceId: string | null = null;
    
    if (session.invoice) {
      try {
        const invoice = await this.stripe.invoices.retrieve(session.invoice as string);
        invoiceUrl = invoice.hosted_invoice_url ?? null;
        invoiceId = invoice.id;
      } catch (err) {
        console.error('Failed to retrieve invoice:', err);
      }
    }

    // Create payment record
    await this.prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        amount: (session.amount_total || 0) / 100, // Convert from cents to euros
        currency: (session.currency || 'eur').toUpperCase(),
        status: 'SUCCEEDED',
        stripePaymentId: session.payment_intent as string,
        stripeInvoiceId: invoiceId,
        stripeInvoiceUrl: invoiceUrl,
        paidAt: new Date(),
      },
    });

    console.log(`✅ Subscription created for user ${userId}: ${subscription.id}`);
  }

  /**
   * Get invoice URL for a payment
   */
  async getInvoiceUrl(userId: string) {
    // Get user's latest payment with invoice
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: {
          include: {
            payments: {
              where: {
                status: 'SUCCEEDED',
                stripeInvoiceUrl: { not: null },
              },
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    if (!user || !user.subscription || user.subscription.payments.length === 0) {
      throw new BadRequestException('Aucune facture disponible');
    }

    const payment = user.subscription.payments[0];
    
    return {
      invoiceUrl: payment.stripeInvoiceUrl,
      invoiceId: payment.stripeInvoiceId,
      amount: payment.amount,
      currency: payment.currency,
      paidAt: payment.paidAt,
    };
  }

  /**
   * DEBUG: Get all subscriptions with payments (for testing)
   */
  async getAllSubscriptions() {
    const subscriptions = await this.prisma.subscription.findMany({
      include: {
        users: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      total: subscriptions.length,
      subscriptions,
    };
  }
}
