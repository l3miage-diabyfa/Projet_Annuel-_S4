import { 
  Injectable, 
  NotFoundException, 
  ConflictException,
  BadRequestException 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Common query to include relations
   */
  private readonly includeRelations = {
    teacher: {
      select: { 
        id: true, 
        firstname: true, 
        lastname: true, 
        email: true, 
        role: true 
      },
    },
    enrollments: {
      include: {
        student: {
          select: { 
            id: true, 
            firstname: true, 
            lastname: true, 
            email: true, 
            role: true 
          },
        },
      },
    },
  };

  async create(createClassDto: CreateClassDto) {
  // Validate teacher exists
  const teacher = await this.prisma.user.findUnique({
    where: { id: createClassDto.teacherId },
  });

  if (!teacher) {
    throw new NotFoundException(`Teacher with ID ${createClassDto.teacherId} not found`);
  }

  // Allow TEACHER and ADMIN (for testing)
  if (teacher.role !== 'TEACHER' && teacher.role !== 'ADMIN') {
    throw new BadRequestException('Seuls les responsables pédagogiques peuvent créer des classes');
  }

  // Check for duplicate class name by same teacher
  const existingClass = await this.prisma.class.findFirst({
    where: {
      name: createClassDto.name,
      teacherId: createClassDto.teacherId,
    },
  });

  if (existingClass) {
    throw new ConflictException(`Class "${createClassDto.name}" already exists for this teacher`);
  }

  // ✅ NEW: Process student emails if provided
  let studentEmails: string[] = [];
  if (createClassDto.studentEmails) {
    studentEmails = createClassDto.studentEmails
      .split(';')
      .map(email => email.trim())
      .filter(email => email.length > 0);
  }

  // Create the class
  const classItem = await this.prisma.class.create({
    data: createClassDto,
    include: this.includeRelations,
  });

  // ✅ NEW: Create student users and enrollments
  if (studentEmails.length > 0) {
    for (const email of studentEmails) {
      // Check if student already exists
      let student = await this.prisma.user.findUnique({
        where: { email },
      });

      // If student doesn't exist, create invitation
      if (!student) {
        student = await this.prisma.user.create({
          data: {
            email,
            lastname: '',
            firstname: '',
            password: '', // They'll set it later via invitation
            role: 'STUDENT',
            establishmentId: teacher.establishmentId,
          },
        });
      }

      // Create enrollment
      await this.prisma.enrollment.create({
        data: {
          classId: classItem.id,
          studentId: student.id,
        },
      });
    }
  }

  // Return class with updated enrollments
  return this.prisma.class.findUnique({
    where: { id: classItem.id },
    include: this.includeRelations,
  });
}

  /**
   * READ - Get all classes
   */
  async findAll(teacherId?: string, isActive?: boolean) {
    const where: any = {};
  
    if (teacherId) {
      where.teacherId = teacherId;
    }
  
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    return this.prisma.class.findMany({
      where,
      include: this.includeRelations,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * READ - Get one class by ID
   */
  async findOne(id: string) {
    const classItem = await this.prisma.class.findUnique({
      where: { id },
      include: this.includeRelations,
    });

    if (!classItem) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    return classItem;
  }

  /**
   * READ - Get classes by teacher
   */
  async findByTeacher(teacherId: string) {
    // Verify teacher exists
    const teacher = await this.prisma.user.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    return this.prisma.class.findMany({
      where: { teacherId },
      include: this.includeRelations,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * UPDATE - Update a class
   */
  async update(id: string, updateClassDto: UpdateClassDto) {
    // Check if class exists
    await this.findOne(id);

    // Check for duplicate name if name is being updated
    if (updateClassDto.name) {
      const classItem = await this.prisma.class.findUnique({
        where: { id },
      });

      const existingClass = await this.prisma.class.findFirst({
        where: {
          name: updateClassDto.name,
          teacherId: classItem!.teacherId,
          NOT: { id },
        },
      });

      if (existingClass) {
        throw new ConflictException(
          `Class "${updateClassDto.name}" already exists for this teacher`
        );
      }
    }

    return this.prisma.class.update({
      where: { id },
      data: updateClassDto,
      include: this.includeRelations,
    });
  }

  /**
   * DELETE - Remove a class
   */
  async remove(id: string) {
    // Check if class exists
    await this.findOne(id);

    // Prisma will automatically delete enrollments (CASCADE)
    await this.prisma.class.delete({
      where: { id },
    });

    return { message: `Class with ID ${id} has been deleted` };
  }

  /**
   * ADD STUDENT - Enroll a student in a class
   */
  async addStudent(classId: string, studentId: string) {
    // Verify class exists
    await this.findOne(classId);

    // Verify student exists and has STUDENT role
    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    if (student.role !== 'STUDENT') {
      throw new BadRequestException('User must have STUDENT role');
    }

    // Check if already enrolled
    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: {
        classId_studentId: { classId, studentId },
      },
    });

    if (existingEnrollment) {
      throw new ConflictException(
        `Student ${student.firstname} ${student.lastname} is already enrolled in this class`
      );
    }

    return this.prisma.enrollment.create({
      data: { classId, studentId },
      include: {
        student: {
          select: { id: true, firstname: true, lastname: true, email: true, role: true },
        },
        class: {
          select: { id: true, name: true },
        },
      },
    });
  }

  /**
   * REMOVE STUDENT - Unenroll a student from a class
   */
  async removeStudent(classId: string, studentId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        classId_studentId: { classId, studentId },
      },
    });

    if (!enrollment) {
      throw new NotFoundException(
        'Student is not enrolled in this class'
      );
    }

    await this.prisma.enrollment.delete({
      where: {
        classId_studentId: { classId, studentId },
      },
    });

    return { message: 'Student removed from class successfully' };
  }

  /**
   * UTILITY - Get class statistics
   */
  async getStatistics(classId: string) {
    const classItem = await this.findOne(classId);

    return {
      classId: classItem.id,
      name: classItem.name,
      teacher: classItem.teacher.firstname + ' ' + classItem.teacher.lastname,
      totalStudents: classItem.enrollments.length,
      students: classItem.enrollments.map(e => ({
        id: e.student.id,
        name: e.student.firstname + ' ' + e.student.lastname,
        email: e.student.email,
        enrolledAt: e.createdAt,
      })),
    };
  }

  /**
   * ARCHIVE - Archive a class
   */
  async archive(id: string) {
    // Check if class exists
    await this.findOne(id);

    const archivedClass = await this.prisma.class.update({
      where: { id },
      data: { isActive: false },
      include: this.includeRelations,
    });

    // TODO: Send email notification
    // await this.mailerService.sendClassArchivedEmail(
    //   archivedClass.teacher.email,
    //   archivedClass.name
    // );

    return archivedClass;
  }

  /**
   * UNARCHIVE - Reactivate a class
   */
  async unarchive(id: string) {
    await this.findOne(id);

    return this.prisma.class.update({
      where: { id },
      data: { isActive: true },
      include: this.includeRelations,
    });
  }

}