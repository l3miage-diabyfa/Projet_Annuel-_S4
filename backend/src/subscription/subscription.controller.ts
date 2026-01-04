import { Controller, Post, Body, UseGuards, Request, Headers, Req, Get } from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { SubscriptionService } from './subscription.service';
import { ValidateCheckoutDto } from './dto/validate-checkout.dto';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { JwtAuthGuard } from '../user/jwt-auth.guard';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('validate-checkout')
  @UseGuards(JwtAuthGuard)
  async validateCheckout(
    @Request() req,
    @Body() dto: ValidateCheckoutDto,
  ) {
    return this.subscriptionService.validateCheckout(req.user.userId, dto);
  }

  @Post('create-checkout-session')
  @UseGuards(JwtAuthGuard)
  async createCheckoutSession(
    @Request() req,
    @Body() dto: CreateCheckoutSessionDto,
  ) {
    return this.subscriptionService.createCheckoutSession(req.user.userId, dto);
  }

  @Get('invoice')
  @UseGuards(JwtAuthGuard)
  async getInvoiceUrl(@Request() req) {
    return this.subscriptionService.getInvoiceUrl(req.user.userId);
  }

  @Get('debug/all')
  async getAllSubscriptions() {
    return this.subscriptionService.getAllSubscriptions();
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: ExpressRequest,
  ) {
    // When using express.raw() middleware, body is a Buffer
    const rawBody = req.body as Buffer;
    
    if (!rawBody || !Buffer.isBuffer(rawBody)) {
      throw new Error('Raw body is required for webhook signature verification');
    }
    
    return this.subscriptionService.handleStripeWebhook(signature, rawBody);
  }
}
