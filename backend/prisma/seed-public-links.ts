import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Adding publicLink to existing ReviewForms...');

  const forms = await prisma.reviewForm.findMany({
    where: {
      publicLink: null,
    },
  });

  console.log(`Found ${forms.length} forms without publicLink`);

  for (const form of forms) {
    await prisma.reviewForm.update({
      where: { id: form.id },
      data: { publicLink: uuidv4() },
    });
    console.log(`✅ Updated form ${form.id}`);
  }

  console.log('✅ Done!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });