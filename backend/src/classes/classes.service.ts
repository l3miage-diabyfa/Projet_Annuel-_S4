import { 
  Injectable, 
  NotFoundException, 
  ConflictException,
  BadRequestException 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class, Prisma } from '@prisma/client';

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
  } satisfies Prisma.ClassInclude;

  /**
   * CREATE - Create a new class
   */
  async create(createClassDto: CreateClassDto) {
    // Validate teacher exists
    const teacher = await this.prisma.user.findUnique({
      where: { id: createClassDto.teacherId },
    });

    if (!teacher) {
      throw new NotFoundException(
        `Teacher with ID ${createClassDto.teacherId} not found`
      );
    }

    // Check if user has permission to create a class
    const allowedRoles = ['TEACHER', 'ADMIN', 'REFERENT'];
    if (!allowedRoles.includes(teacher.role)) {
      throw new BadRequestException(
        'User must have TEACHER, ADMIN, or REFERENT role to create a class'
      );
    }

    // Check for duplicate class name by same teacher
    const existingClass = await this.prisma.class.findFirst({
      where: {
        name: createClassDto.name,
        teacherId: createClassDto.teacherId,
      },
    });

    if (existingClass) {
      throw new ConflictException(
        `Class "${createClassDto.name}" already exists for this teacher`
      );
    }

    return this.prisma.class.create({
      data: createClassDto,
      include: this.includeRelations,
    });
  }

  /**
   * READ - Get all classes
   */
  async findAll(teacherId?: string) {
    const where = teacherId ? { teacherId } : {};

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
}