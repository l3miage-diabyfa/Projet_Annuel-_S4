import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creating default review forms...');

  // Get all classes
  const classes = await prisma.class.findMany();

  for (const classItem of classes) {
    // Create "During Class" form
    const duringForm = await prisma.reviewForm.create({
      data: {
        title: 'Évaluation pendant le cours',
        type: 'DURING_CLASS',
        classId: classItem.id,
        isActive: true,
        fields: {
          create: [
            {
              label: 'Globalement vous avez trouvé ce cours',
              type: 'STARS',
              required: true,
              order: 0,
            },
            {
              label: 'Le ratio Théorie/Pratique',
              type: 'RADIO',
              required: true,
              options: [
                "J'aurais aimé plus de mode atelier",
                "Juste comme il faut",
                "J'aurais aimé plus de mode cours",
              ],
              order: 1,
            },
            {
              label: "L'ambiance durant le cours était",
              type: 'RADIO',
              required: true,
              options: ['Sympa', 'Moyen', 'Mauvaise'],
              order: 2,
            },
            {
              label: 'Le nombre d\'heures',
              type: 'RADIO',
              required: true,
              options: ['Trop peu', 'Bien', 'Trop'],
              order: 3,
            },
            {
              label: 'Pertinence des informations',
              type: 'RADIO',
              required: true,
              options: ['Top', 'Moyen', 'Nul'],
              order: 4,
            },
            {
              label: 'Commentaires libres',
              type: 'TEXTAREA',
              required: false,
              order: 5,
            },
          ],
        },
      },
    });

    // Create "After Class" form
    const afterForm = await prisma.reviewForm.create({
      data: {
        title: 'Évaluation fin du cours',
        type: 'AFTER_CLASS',
        classId: classItem.id,
        isActive: true,
        fields: {
          create: [
            {
              label: 'Note globale de la matière',
              type: 'STARS',
              required: true,
              order: 0,
            },
            {
              label: 'Les objectifs pédagogiques ont-ils été atteints ?',
              type: 'RADIO',
              required: true,
              options: ['Oui, totalement', 'Partiellement', 'Non'],
              order: 1,
            },
            {
              label: 'Recommanderiez-vous cette matière ?',
              type: 'RADIO',
              required: true,
              options: ['Oui', 'Peut-être', 'Non'],
              order: 2,
            },
            {
              label: 'Commentaire final',
              type: 'TEXTAREA',
              required: false,
              order: 3,
            },
          ],
        },
      },
    });

    console.log(`✅ Created forms for class ${classItem.name}`);
  }

  console.log('🎉 Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });