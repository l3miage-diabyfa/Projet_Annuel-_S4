declare module '@prisma/client' {
  export type Role = 'TEACHER' | 'STUDENT' | 'ADMIN';

  export interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Class {
    id: string;
    name: string;
    description: string | null;
    teacherId: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface StudentEnrollment {
    id: string;
    classId: string;
    studentId: string;
    createdAt: Date;
  }

  export namespace Prisma {
    export interface ClassInclude {
      teacher?: boolean | { select?: any };
      enrollments?: boolean | { include?: any };
    }
  }

  export class PrismaClient {
    user: {
      findUnique: (args: any) => Promise<User | null>;
      findMany: (args: any) => Promise<User[]>;
      create: (args: any) => Promise<User>;
      update: (args: any) => Promise<User>;
      delete: (args: any) => Promise<User>;
      count: (args?: any) => Promise<number>;
      upsert: (args: any) => Promise<User>;
    };
    class: {
      findUnique: (args: any) => Promise<any>;
      findMany: (args: any) => Promise<any[]>;
      findFirst: (args: any) => Promise<any>;
      create: (args: any) => Promise<any>;
      update: (args: any) => Promise<any>;
      delete: (args: any) => Promise<any>;
      count: (args?: any) => Promise<number>;
      upsert: (args: any) => Promise<any>;
    };
    studentEnrollment: {
      findUnique: (args: any) => Promise<any>;
      findMany: (args: any) => Promise<any[]>;
      create: (args: any) => Promise<any>;
      delete: (args: any) => Promise<any>;
      upsert: (args: any) => Promise<any>;
    };
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
  }
}