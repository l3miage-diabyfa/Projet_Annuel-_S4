import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create establishment
  const establishment = await prisma.establishment.upsert({
    where: { name: 'Test School' },
    update: {},
    create: {
      name: 'Test School',
    },
  });

  // Create admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: {
      email: 'admin@school.com',
      firstname: 'Super',
      lastname: 'Admin',
      password: 'password',
      role: 'ADMIN',
      establishmentId: establishment.id,
    },
  });

  // Create teachers
  const teacher1 = await prisma.user.upsert({
    where: { email: 'john.doe@school.com' },
    update: {},
    create: {
      email: 'john.doe@school.com',
      firstname: 'John',
      lastname: 'Doe',
      password: 'password',
      role: 'TEACHER',
      establishmentId: establishment.id,
    },
  });

  const teacher2 = await prisma.user.upsert({
    where: { email: 'jane.smith@school.com' },
    update: {},
    create: {
      email: 'jane.smith@school.com',
      firstname: 'Jane',
      lastname: 'Smith',
      password: 'password',
      role: 'TEACHER',
      establishmentId: establishment.id,
    },
  });

  // Create students
  const student1 = await prisma.user.upsert({
    where: { email: 'alice@school.com' },
    update: {},
    create: {
      email: 'alice@school.com',
      firstname: 'Alice',
      lastname: 'Johnson',
      password: 'password',
      role: 'STUDENT',
      establishmentId: establishment.id,
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'bob@school.com' },
    update: {},
    create: {
      email: 'bob@school.com',
      firstname: 'Bob',
      lastname: 'Williams',
      password: 'password',
      role: 'STUDENT',
      establishmentId: establishment.id,
    },
  });

  const student3 = await prisma.user.upsert({
    where: { email: 'charlie@school.com' },
    update: {},
    create: {
      email: 'charlie@school.com',
      firstname: 'Charlie',
      lastname: 'Brown',
      password: 'password',
      role: 'STUDENT',
      establishmentId: establishment.id,
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
      academicYear: '2025-2026',
      gradeLevel: '6e',
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
      academicYear: '2025-2026',
      gradeLevel: '5e',
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
      academicYear: '2025-2026',
      gradeLevel: '4e',
      teacherId: teacher2.id,
    },
  });

  // Enroll students in classes
  await prisma.enrollment.upsert({
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

  await prisma.enrollment.upsert({
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

  await prisma.enrollment.upsert({
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

  await prisma.enrollment.upsert({
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
  console.log(`Establishment: ${establishment.name}, ID: ${establishment.id}`);
  console.log(`Admin: ${admin.firstname} ${admin.lastname}`);
  console.log(`Teachers: ${teacher1.firstname} ${teacher1.lastname}, ${teacher2.firstname} ${teacher2.lastname}`);
  console.log(`Students: ${student1.firstname} ${student1.lastname}, ${student2.firstname} ${student2.lastname}, ${student3.firstname} ${student3.lastname}`);
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