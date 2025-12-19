import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create teachers
  const teacher1 = await prisma.user.upsert({
    where: { email: 'john.doe@school.com' },
    update: {},
    create: {
      email: 'john.doe@school.com',
      name: 'John Doe',
      role: 'TEACHER',
    },
  });

  const teacher2 = await prisma.user.upsert({
    where: { email: 'jane.smith@school.com' },
    update: {},
    create: {
      email: 'jane.smith@school.com',
      name: 'Jane Smith',
      role: 'TEACHER',
    },
  });

  // Create students
  const student1 = await prisma.user.upsert({
    where: { email: 'alice@school.com' },
    update: {},
    create: {
      email: 'alice@school.com',
      name: 'Alice Johnson',
      role: 'STUDENT',
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'bob@school.com' },
    update: {},
    create: {
      email: 'bob@school.com',
      name: 'Bob Williams',
      role: 'STUDENT',
    },
  });

  const student3 = await prisma.user.upsert({
    where: { email: 'charlie@school.com' },
    update: {},
    create: {
      email: 'charlie@school.com',
      name: 'Charlie Brown',
      role: 'STUDENT',
    },
  });

  // Create classes
  const class1 = await prisma.class.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Mathematics 101',
      description: 'Introduction to Algebra and Geometry',
      teacherId: teacher1.id,
    },
  });

  const class2 = await prisma.class.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Physics 101',
      description: 'Basic principles of Physics',
      teacherId: teacher1.id,
    },
  });

  const class3 = await prisma.class.upsert({
    where: { id: '00000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'Literature 101',
      description: 'Introduction to World Literature',
      teacherId: teacher2.id,
    },
  });

  // Enroll students in classes
  await prisma.studentEnrollment.upsert({
    where: {
      classId_studentId: {
        classId: class1.id,
        studentId: student1.id,
      },
    },
    update: {},
    create: {
      classId: class1.id,
      studentId: student1.id,
    },
  });

  await prisma.studentEnrollment.upsert({
    where: {
      classId_studentId: {
        classId: class1.id,
        studentId: student2.id,
      },
    },
    update: {},
    create: {
      classId: class1.id,
      studentId: student2.id,
    },
  });

  await prisma.studentEnrollment.upsert({
    where: {
      classId_studentId: {
        classId: class2.id,
        studentId: student1.id,
      },
    },
    update: {},
    create: {
      classId: class2.id,
      studentId: student1.id,
    },
  });

  await prisma.studentEnrollment.upsert({
    where: {
      classId_studentId: {
        classId: class3.id,
        studentId: student3.id,
      },
    },
    update: {},
    create: {
      classId: class3.id,
      studentId: student3.id,
    },
  });

  console.log('✅ Seed data created!');
  console.log(`Teachers: ${teacher1.name}, ${teacher2.name}`);
  console.log(`Students: ${student1.name}, ${student2.name}, ${student3.name}`);
  console.log(`Classes: ${class1.name}, ${class2.name}, ${class3.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });