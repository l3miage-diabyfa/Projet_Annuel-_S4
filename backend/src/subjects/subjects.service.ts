import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { ImportSubjectsCsvDto, SubjectCsvRowDto } from './dto/import-subjects-csv.dto';
import { AttachFormsDto } from './dto/attach-forms.dto';

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * CREATE - Create a new subject
   */
  async create(createSubjectDto: CreateSubjectDto, userId: string) {
    // Verify class exists
    const classItem = await this.prisma.class.findUnique({
      where: { id: createSubjectDto.classId },
      include: { teacher: true },
    });

    if (!classItem) {
      throw new NotFoundException(
        `Classe avec l'ID ${createSubjectDto.classId} introuvable`
      );
    }

    // Verify user is the teacher of this class or has appropriate role
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    // Check authorization: must be teacher of the class, referent, or admin
    const isTeacherOfClass = classItem.teacherId === userId;
    const isAuthorized = 
      isTeacherOfClass || 
      user.role === 'ADMIN';

    if (!isAuthorized) {
      throw new ForbiddenException(
        'Vous n\'êtes pas autorisé à créer une matière pour cette classe'
      );
    }

    // Validate dates if provided
    if (createSubjectDto.firstLessonDate && createSubjectDto.lastLessonDate) {
      const firstDate = new Date(createSubjectDto.firstLessonDate);
      const lastDate = new Date(createSubjectDto.lastLessonDate);

      if (lastDate < firstDate) {
        throw new BadRequestException(
          'La date du dernier cours doit être postérieure à la date du premier cours'
        );
      }
    }

    return this.prisma.subject.create({
      data: {
        name: createSubjectDto.name,
        instructorName: createSubjectDto.instructorName,
        instructorEmail: createSubjectDto.instructorEmail,
        firstLessonDate: createSubjectDto.firstLessonDate 
          ? new Date(createSubjectDto.firstLessonDate) 
          : null,
        lastLessonDate: createSubjectDto.lastLessonDate 
          ? new Date(createSubjectDto.lastLessonDate) 
          : null,
        classId: createSubjectDto.classId,
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            teacher: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
              },
            },
          },
        },
      },
    });
  }

/**
 * BULK CREATE - Import subjects from CSV
 */
async importFromCsv(importDto: ImportSubjectsCsvDto, userId: string) {
  // Verify class exists
  const classItem = await this.prisma.class.findUnique({
    where: { id: importDto.classId },
    include: { teacher: true },
  });

  if (!classItem) {
    throw new NotFoundException(
      `Classe avec l'ID ${importDto.classId} introuvable`
    );
  }

  // Verify user authorization
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundException('Utilisateur introuvable');
  }

  const isTeacherOfClass = classItem.teacherId === userId;
  const isAuthorized = 
    isTeacherOfClass || 
    user.role === 'ADMIN';

  if (!isAuthorized) {
    throw new ForbiddenException(
      'Vous n\'êtes pas autorisé à importer des matières pour cette classe'
    );
  }

  // Validate and transform CSV rows
  const subjectsToCreate: Array<{
    name: string;
    instructorName: string | null;
    instructorEmail: string | null;
    firstLessonDate: Date | null;
    lastLessonDate: Date | null;
    classId: string;
  }> = [];

  const errors: Array<{
    row: number;
    field?: string;
    message: string;
  }> = [];

  for (let i = 0; i < importDto.subjects.length; i++) {
    const row = importDto.subjects[i];
    const rowNumber = i + 2; // +2 because row 1 is header, array is 0-indexed

    try {
      // Validate dates if provided
      let firstDate: Date | null = null;
      let lastDate: Date | null = null;

      if (row.Date_premier_cours) {
        firstDate = new Date(row.Date_premier_cours);
        if (isNaN(firstDate.getTime())) {
          errors.push({
            row: rowNumber,
            field: 'Date_premier_cours',
            message: 'Date invalide',
          });
          continue;
        }
      }

      if (row.Date_dernier_cours) {
        lastDate = new Date(row.Date_dernier_cours);
        if (isNaN(lastDate.getTime())) {
          errors.push({
            row: rowNumber,
            field: 'Date_dernier_cours',
            message: 'Date invalide',
          });
          continue;
        }
      }

      if (firstDate && lastDate && lastDate < firstDate) {
        errors.push({
          row: rowNumber,
          field: 'Date_dernier_cours',
          message: 'La date du dernier cours doit être postérieure à la date du premier cours',
        });
        continue;
      }

      subjectsToCreate.push({
        name: row.Matiere_nom,
        instructorName: row.Intervenant_nom || null,
        instructorEmail: row.Intervenant_email || null,
        firstLessonDate: firstDate,
        lastLessonDate: lastDate,
        classId: importDto.classId,
      });
    } catch (error) {
      errors.push({
        row: rowNumber,
        message: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    }
  }

  // If there are errors, return them
  if (errors.length > 0) {
    throw new BadRequestException({
      message: 'Erreurs détectées dans le fichier CSV',
      errors,
    });
  }

  // Create all subjects in a transaction
  const createdSubjects = await this.prisma.$transaction(
    subjectsToCreate.map((subject) =>
      this.prisma.subject.create({ data: subject })
    )
  );

  return {
    message: `${createdSubjects.length} matière(s) importée(s) avec succès`,
    count: createdSubjects.length,
    subjects: createdSubjects,
  };
}

  /**
   * READ - Get all subjects for a class
   */
  async findByClass(classId: string, userId: string) {
    const classItem = await this.prisma.class.findUnique({
      where: { id: classId },
      include: { teacher: true },
    });

    if (!classItem) {
      throw new NotFoundException(`Classe avec l'ID ${classId} introuvable`);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    // Check if user has access to this class
    const isTeacherOfClass = classItem.teacherId === userId;
    const isEnrolled = await this.prisma.enrollment.findFirst({
      where: { classId, studentId: userId },
    });
    const isAuthorized = 
      isTeacherOfClass || 
      isEnrolled || 
      user.role === 'REFERENT' || 
      user.role === 'ADMIN';

    if (!isAuthorized) {
      throw new ForbiddenException(
        'Vous n\'avez pas accès aux matières de cette classe'
      );
    }

    // inclusion des formulaires avec stats
    return this.prisma.subject.findMany({
      where: { classId },
      orderBy: { createdAt: 'desc' },
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        // Include review forms with response counts
        duringForm: {
          include: {
            _count: {
              select: {
                reviews: true,
              },
            },
          },
        },
        afterForm: {
          include: {
            _count: {
              select: {
                reviews: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * READ - Get one subject by ID
   */
  async findOne(id: string, userId: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
      include: {
        class: {
          include: {
            teacher: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
              },
            },
          },
        },
      },
    });

    if (!subject) {
      throw new NotFoundException(`Matière avec l'ID ${id} introuvable`);
    }

    // Verify user has access
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const isTeacherOfClass = subject.class.teacherId === userId;
    const isEnrolled = await this.prisma.enrollment.findFirst({
      where: { classId: subject.classId, studentId: userId },
    });
    const isAuthorized = 
      isTeacherOfClass || 
      isEnrolled || 
      user.role === 'REFERENT' || 
      user.role === 'ADMIN';

    if (!isAuthorized) {
      throw new ForbiddenException(
        'Vous n\'avez pas accès à cette matière'
      );
    }

    return subject;
  }

  /**
   * UPDATE - Update a subject
   */
  async update(id: string, updateSubjectDto: UpdateSubjectDto, userId: string) {
    // Verify subject exists
    const subject = await this.findOne(id, userId);

    // Verify user authorization for updates
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const isTeacherOfClass = subject.class.teacherId === userId;
    const isAuthorized = 
      isTeacherOfClass || 
      user.role === 'ADMIN';

    if (!isAuthorized) {
      throw new ForbiddenException(
        'Vous n\'êtes pas autorisé à modifier cette matière'
      );
    }

    // Validate dates if provided
    const updateData: any = { ...updateSubjectDto };

    if (updateSubjectDto.firstLessonDate) {
      updateData.firstLessonDate = new Date(updateSubjectDto.firstLessonDate);
    }

    if (updateSubjectDto.lastLessonDate) {
      updateData.lastLessonDate = new Date(updateSubjectDto.lastLessonDate);
    }

    // Check date logic
    const firstDate = updateData.firstLessonDate || subject.firstLessonDate;
    const lastDate = updateData.lastLessonDate || subject.lastLessonDate;

    if (firstDate && lastDate && lastDate < firstDate) {
      throw new BadRequestException(
        'La date du dernier cours doit être postérieure à la date du premier cours'
      );
    }

    return this.prisma.subject.update({
      where: { id },
      data: updateData,
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * DELETE - Remove a subject
   */
  async remove(id: string, userId: string) {
    // Verify subject exists and user has access
    const subject = await this.findOne(id, userId);

    // Verify user authorization for deletion
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const isTeacherOfClass = subject.class.teacherId === userId;
    const isAuthorized = 
      isTeacherOfClass || 
      user.role === 'ADMIN';

    if (!isAuthorized) {
      throw new ForbiddenException(
        'Vous n\'êtes pas autorisé à supprimer cette matière'
      );
    }

    await this.prisma.subject.delete({
      where: { id },
    });

    return { 
      message: `La matière "${subject.name}" a été supprimée avec succès` 
    };
  }

  /**
   * UTILITY - Generate CSV template
   */
  generateCsvTemplate(): string {
    const headers = [
      'Matiere_nom',
      'Intervenant_nom',
      'Intervenant_email',
      'Date_premier_cours',
      'Date_dernier_cours',
    ];

    const exampleRow = [
      'Mathématiques',
      'Jean Dupont',
      'jean.dupont@example.com',
      '2024-01-15',
      '2024-06-30',
    ];

    return `${headers.join(',')}\n${exampleRow.join(',')}`;
  }

  /**
   * Attach review forms to a subject
   */
  async attachReviewForms(
    subjectId: string,
    dto: AttachFormsDto,
    userId: string,
  ) {
    // Get subject with class
    const subject = await this.prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        class: true,
      },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    // Get user to check role
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Allow ADMIN or TEACHER of the class
    const isTeacherOfClass = subject.class.teacherId === userId;
    const isAdmin = user.role === 'ADMIN';

    if (!isTeacherOfClass && !isAdmin) {
      throw new ForbiddenException('Access denied');
    }

    // Validate forms exist and belong to same class
    if (dto.duringFormId) {
      const duringForm = await this.prisma.reviewForm.findUnique({
        where: { id: dto.duringFormId },
      });

      // Allow global forms (classId = null) OR forms from same class
      if (!duringForm) {
        throw new BadRequestException('During form not found');
      }

      if (duringForm.classId !== null && duringForm.classId !== subject.classId) {
        throw new BadRequestException('Invalid during form - must be global or from same class');
      }
    }

    if (dto.afterFormId) {
      const afterForm = await this.prisma.reviewForm.findUnique({
        where: { id: dto.afterFormId },
      });

      // Allow global forms (classId = null) OR forms from same class
      if (!afterForm) {
        throw new BadRequestException('After form not found');
      }

      if (afterForm.classId !== null && afterForm.classId !== subject.classId) {
        throw new BadRequestException('Invalid after form - must be global or from same class');
      }
    }

    // Update subject
    return this.prisma.subject.update({
      where: { id: subjectId },
      data: {
        duringFormId: dto.duringFormId,
        afterFormId: dto.afterFormId,
      },
      include: {
        duringForm: true,
        afterForm: true,
      },
    });
  }

  /**
   * Get subject with forms and response counts
   */
  async getSubjectWithFormStats(subjectId: string, userId: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        class: true,
        duringForm: {
          include: {
            reviews: true,
          },
        },
        afterForm: {
          include: {
            reviews: true,
          },
        },
      },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    // Verify access
    if (subject.class.teacherId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return {
      ...subject,
      duringFormStats: subject.duringForm ? {
        totalResponses: subject.duringForm.reviews.length,
        publicLink: `${process.env.FRONTEND_URL}/review/${subject.duringForm.publicLink}`,
      } : null,
      afterFormStats: subject.afterForm ? {
        totalResponses: subject.afterForm.reviews.length,
        publicLink: `${process.env.FRONTEND_URL}/review/${subject.afterForm.publicLink}`,
      } : null,
    };
  }
}