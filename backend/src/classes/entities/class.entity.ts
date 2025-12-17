import { User } from '@prisma/client';

export class Class {
  id: string;
  name: string;
  description: string | null;
  teacherId: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations (optional, for type safety)
  teacher?: User;
  enrollments?: StudentEnrollment[];
}

export class StudentEnrollment {
  id: string;
  classId: string;
  studentId: string;
  createdAt: Date;
  student?: User;
}