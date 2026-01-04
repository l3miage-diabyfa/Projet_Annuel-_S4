import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../common/email/email.service';

@Injectable()
export class ReviewSchedulerService {
  private readonly logger = new Logger(ReviewSchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Cron job qui s'exécute tous les jours à 9h00
   * Vérifie et envoie les invitations pour les formulaires d'avis
   */
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleReviewInvitations() {
    this.logger.log('Vérification des invitations de formulaires à envoyer...');

    try {
      const now = new Date();

      // Envoyer les formulaires "pendant le cours"
      await this.sendDuringCourseInvitations(now);

      // Envoyer les formulaires "fin du cours"
      await this.sendAfterCourseInvitations(now);

      this.logger.log('Vérification des invitations terminée');
    } catch (error) {
      this.logger.error('Erreur lors de l\'envoi des invitations', error);
    }
  }

  /**
   * Envoie les invitations pour les formulaires "pendant le cours"
   * Date d'envoi = date du milieu du cours (50% entre firstLessonDate et lastLessonDate)
   */
  private async sendDuringCourseInvitations(now: Date) {
    const subjects = await this.prisma.subject.findMany({
      where: {
        duringFormId: { not: null },
        duringFormSentAt: null, // Pas encore envoyé
        firstLessonDate: { not: null },
        lastLessonDate: { not: null },
      },
      include: {
        class: {
          include: {
            enrollments: {
              include: {
                student: {
                  select: {
                    email: true,
                    firstname: true,
                    lastname: true,
                  },
                },
              },
            },
          },
        },
        duringForm: true,
      },
    });

    for (const subject of subjects) {
      if (!subject.firstLessonDate || !subject.lastLessonDate) continue;

      // Calculer la date du milieu du cours
      const firstDate = subject.firstLessonDate.getTime();
      const lastDate = subject.lastLessonDate.getTime();
      const middleDate = new Date(firstDate + (lastDate - firstDate) / 2);

      // Vérifier si on est à la date d'envoi (même jour ou après)
      if (
        now.getFullYear() === middleDate.getFullYear() &&
        now.getMonth() === middleDate.getMonth() &&
        now.getDate() >= middleDate.getDate()
      ) {
        this.logger.log(
          `Envoi des invitations "pendant le cours" pour la matière: ${subject.name}`,
        );

        await this.sendInvitations(
          subject,
          'DURING_CLASS',
          'duringFormSentAt',
        );
      }
    }
  }

  /**
   * Envoie les invitations pour les formulaires "fin du cours"
   * Date d'envoi = lastLessonDate
   */
  private async sendAfterCourseInvitations(now: Date) {
    const subjects = await this.prisma.subject.findMany({
      where: {
        afterFormId: { not: null },
        afterFormSentAt: null, // Pas encore envoyé
        lastLessonDate: { not: null },
      },
      include: {
        class: {
          include: {
            enrollments: {
              include: {
                student: {
                  select: {
                    email: true,
                    firstname: true,
                    lastname: true,
                  },
                },
              },
            },
          },
        },
        afterForm: true,
      },
    });

    for (const subject of subjects) {
      if (!subject.lastLessonDate) continue;

      const lastDate = subject.lastLessonDate;

      // Vérifier si on est à la date d'envoi (même jour ou après)
      if (
        now.getFullYear() === lastDate.getFullYear() &&
        now.getMonth() === lastDate.getMonth() &&
        now.getDate() >= lastDate.getDate()
      ) {
        this.logger.log(
          `Envoi des invitations "fin du cours" pour la matière: ${subject.name}`,
        );

        await this.sendInvitations(subject, 'AFTER_CLASS', 'afterFormSentAt');
      }
    }
  }

  /**
   * Envoie les invitations par email aux étudiants
   */
  private async sendInvitations(
    subject: any,
    formType: 'DURING_CLASS' | 'AFTER_CLASS',
    sentAtField: 'duringFormSentAt' | 'afterFormSentAt',
  ) {
    const form = formType === 'DURING_CLASS' ? subject.duringForm : subject.afterForm;

    if (!form) {
      this.logger.warn(
        `Aucun formulaire ${formType} trouvé pour la matière ${subject.name}`,
      );
      return;
    }

    const students = subject.class.enrollments.map((e) => ({
      email: e.student.email,
      firstname: e.student.firstname,
    }));

    if (students.length === 0) {
      this.logger.warn(
        `Aucun étudiant inscrit dans la classe ${subject.class.name}`,
      );
      return;
    }

    const formTypeLabel =
      formType === 'DURING_CLASS' ? 'Pendant le cours' : 'Fin du cours';

    try {
      const result = await this.emailService.sendBulkReviewInvitations(
        students,
        {
          subjectName: subject.name,
          className: subject.class.name,
          instructorName: subject.instructorName || 'Intervenant',
          formType: formTypeLabel,
          publicLink: form.publicLink,
        },
      );

      this.logger.log(
        `Invitations envoyées pour ${subject.name}: ${result.sent} réussis, ${result.failed} échecs`,
      );

      // Mettre à jour la date d'envoi
      await this.prisma.subject.update({
        where: { id: subject.id },
        data: { [sentAtField]: new Date() },
      });
    } catch (error) {
      this.logger.error(
        `Erreur lors de l'envoi des invitations pour ${subject.name}`,
        error,
      );
    }
  }

  /**
   * Méthode pour envoyer manuellement les invitations
   * (utilisée par le controller)
   */
  async sendManualInvitations(
    subjectId: string,
    formType: 'DURING_CLASS' | 'AFTER_CLASS',
  ) {
    const subject = await this.prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        class: {
          include: {
            enrollments: {
              include: {
                student: {
                  select: {
                    email: true,
                    firstname: true,
                    lastname: true,
                  },
                },
              },
            },
          },
        },
        duringForm: true,
        afterForm: true,
      },
    });

    if (!subject) {
      throw new Error('Matière introuvable');
    }

    const sentAtField =
      formType === 'DURING_CLASS' ? 'duringFormSentAt' : 'afterFormSentAt';

    await this.sendInvitations(subject, formType, sentAtField);

    return {
      message: 'Invitations envoyées avec succès',
      subjectName: subject.name,
      formType,
    };
  }
}
