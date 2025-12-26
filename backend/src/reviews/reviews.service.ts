import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewFormDto } from './dto/create-review-form.dto';
import { SubmitReviewDto } from './dto/submit-review.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * CREATE - Create a review form (TEACHER only)
   */
  async createReviewForm(dto: CreateReviewFormDto, userId: string) {
    // Verify class exists and user is the teacher
    const classItem = await this.prisma.class.findUnique({
      where: { id: dto.classId },
    });

    if (!classItem) {
      throw new NotFoundException('Classe introuvable');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    // Allow TEACHER and ADMIN (for testing/admin purposes)
    if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN')) {
      throw new ForbiddenException('Seuls les enseignants et administrateurs peuvent créer des formulaires');
    }

    // Allow TEACHER and ADMIN (for testing/admin purposes)
    if (user.role === 'TEACHER' && classItem.teacherId !== userId) {
      throw new ForbiddenException('Vous ne pouvez créer des formulaires que pour vos classes');
    }

    // If subjectId provided, verify it belongs to the class
    if (dto.subjectId) {
      const subject = await this.prisma.subject.findUnique({
        where: { id: dto.subjectId },
      });

      if (!subject || subject.classId !== dto.classId) {
        throw new BadRequestException('Matière invalide pour cette classe');
      }
    }

    // Create form with fields
    return this.prisma.reviewForm.create({
      data: {
        title: dto.title,
        type: dto.type,
        classId: dto.classId,
        subjectId: dto.subjectId,
        fields: {
          create: dto.fields.map((field) => ({
            label: field.label,
            type: field.type,
            required: field.required,
            options: field.options ? field.options : undefined,
            order: field.order,
          })),
        },
      },
      include: {
        fields: {
          orderBy: { order: 'asc' },
        },
        class: {
          select: { id: true, name: true },
        },
        subject: {
          select: { id: true, name: true },
        },
      },
    });
  }

  /**
   * SUBMIT - Student submits a review (PUBLIC - no auth required)
   */
  async submitReview(dto: SubmitReviewDto, studentId?: string, ipAddress?: string) {
    // Verify form exists and is active
    const form = await this.prisma.reviewForm.findUnique({
      where: { id: dto.formId },
      include: {
        fields: true,
      },
    });

    if (!form) {
      throw new NotFoundException('Formulaire introuvable');
    }

    if (!form.isActive) {
      throw new BadRequestException('Ce formulaire n\'est plus actif');
    }

    // Validate all required fields are present
    const requiredFieldIds = form.fields
      .filter((f) => f.required)
      .map((f) => f.id);

    const providedFieldIds = dto.responses.map((r) => r.fieldId);

    const missingFields = requiredFieldIds.filter(
      (id) => !providedFieldIds.includes(id),
    );

    if (missingFields.length > 0) {
      throw new BadRequestException('Tous les champs obligatoires doivent être remplis');
    }

    // Validate field values
    for (const response of dto.responses) {
      const field = form.fields.find((f) => f.id === response.fieldId);

      if (!field) {
        throw new BadRequestException(`Champ ${response.fieldId} invalide`);
      }

      // Validate based on field type
      switch (field.type) {
        case 'STARS':
          if (typeof response.value !== 'number' || response.value < 1 || response.value > 5) {
            throw new BadRequestException(`La note doit être entre 1 et 5 étoiles`);
          }
          break;

        case 'RADIO':
          if (typeof response.value !== 'string') {
            throw new BadRequestException(`Le champ "${field.label}" doit être une chaîne`);
          }
          // FIX: Proper type checking for JSON field
          if (field.options && Array.isArray(field.options)) {
            const optionsArray = field.options as string[];
            if (!optionsArray.includes(response.value)) {
              throw new BadRequestException(`Valeur invalide pour "${field.label}"`);
            }
          }
          break;

        case 'CHECKBOX':
          if (!Array.isArray(response.value)) {
            throw new BadRequestException(`Le champ "${field.label}" doit être un tableau`);
          }
          // FIX: Proper type checking for JSON field
          if (field.options && Array.isArray(field.options)) {
            const optionsArray = field.options as string[];
            const invalidOptions = response.value.filter(
              (v: string) => !optionsArray.includes(v),
            );
            if (invalidOptions.length > 0) {
              throw new BadRequestException(`Valeurs invalides pour "${field.label}"`);
            }
          }
          break;

        case 'TEXTAREA':
          if (typeof response.value !== 'string') {
            throw new BadRequestException(`Le champ "${field.label}" doit être une chaîne`);
          }
          break;
      }
    }

    // Create review
    const publicLink = uuidv4();

    const review = await this.prisma.review.create({
      data: {
        formId: dto.formId,
        studentId,
        sessionId: dto.sessionId,
        publicLink,
        ipAddress,
        responses: {
          create: dto.responses.map((r) => ({
            fieldId: r.fieldId,
            value: r.value,
          })),
        },
      },
      include: {
        responses: {
          include: {
            field: true,
          },
        },
      },
    });

    return {
      message: 'Avis soumis avec succès',
      reviewId: review.id,
      publicLink: review.publicLink,
    };
  }

  /**
   * GET - Get review form by ID (PUBLIC)
   */
  async getReviewForm(formId: string) {
    const form = await this.prisma.reviewForm.findUnique({
      where: { id: formId },
      include: {
        fields: {
          orderBy: { order: 'asc' },
        },
        class: {
          select: { id: true, name: true },
        },
        subject: {
          select: { id: true, name: true },
        },
      },
    });

    if (!form) {
      throw new NotFoundException('Formulaire introuvable');
    }

    if (!form.isActive) {
      throw new BadRequestException('Ce formulaire n\'est plus actif');
    }

    return form;
  }

  /**
   * GET - Get all forms for a class (TEACHER only)
   */
  async getFormsByClass(classId: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    // Allow TEACHER and ADMIN (for testing)
    if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN')) {
      throw new ForbiddenException('Accès refusé');
    }

    const classItem = await this.prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classItem) {
      throw new NotFoundException('Classe introuvable');
    }

    // Only check ownership if user is TEACHER (not ADMIN)
    if (user.role === 'TEACHER' && classItem.teacherId !== userId) {
      throw new ForbiddenException('Vous ne pouvez voir que vos propres formulaires');
    }
    // ADMIN can see forms for any class

    return this.prisma.reviewForm.findMany({
      where: { classId },
      include: {
        fields: {
          orderBy: { order: 'asc' },
        },
        subject: {
          select: { id: true, name: true },
        },
        _count: {
          select: { reviews: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * GET - Get reviews for a form (TEACHER only)
   */
  async getReviewsForForm(formId: string, userId: string) {
    const form = await this.prisma.reviewForm.findUnique({
      where: { id: formId },
      include: { class: true },
    });

    if (!form) {
      throw new NotFoundException('Formulaire introuvable');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    // Allow TEACHER and ADMIN (for testing)
    if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN')) {
      throw new ForbiddenException('Accès refusé');
    }

    // Only check ownership if user is TEACHER (not ADMIN)
    if (user.role === 'TEACHER' && form.class.teacherId !== userId) {
      throw new ForbiddenException('Accès refusé');
    }
    // ADMIN can see responses for any form

    return this.prisma.review.findMany({
      where: { formId },
      include: {
        responses: {
          include: {
            field: true,
          },
        },
        student: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }
}