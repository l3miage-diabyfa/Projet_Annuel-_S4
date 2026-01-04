import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creating global review form templates...');

  // ✅ Formulaire "Pendant le cours" - GLOBAL
  const duringFormTemplate = await prisma.reviewForm.create({
    data: {
      title: 'Évaluation pendant le cours',
      type: 'DURING_CLASS',
      classId: null, // ✅ PAS DE CLASSE = GLOBAL
      isActive: true,
      fields: {
        create: [
          {
            label: 'Globalement, vous avez trouvé ce cours...',
            type: 'STARS',
            required: true,
            order: 0,
          },
          {
            label: 'Le ratio théorie/pratique',
            type: 'RADIO',
            required: true,
            options: [
              'Juste comme il faut',
              "J'aurais aimé plus de théorie",
              "J'aurais aimé plus de pratique",
            ],
            order: 1,
          },
          {
            label: "L'ambiance durant le cours",
            type: 'RADIO',
            required: true,
            options: ['Excellente', 'Bonne', 'Moyenne', 'Mauvaise'],
            order: 2,
          },
          {
            label: 'La pertinence des infos',
            type: 'RADIO',
            required: true,
            options: [
              'Très pertinent',
              'Pertinent',
              'Peu pertinent',
              'Pas pertinent',
            ],
            order: 3,
          },
          {
            label: 'Commentaires libres',
            type: 'TEXTAREA',
            required: false,
            order: 4,
          },
        ],
      },
    },
  });

  // ✅ Formulaire "Fin du cours" - GLOBAL
  const afterFormTemplate = await prisma.reviewForm.create({
    data: {
      title: 'Évaluation fin du cours',
      type: 'AFTER_CLASS',
      classId: null, // PAS DE CLASSE = GLOBAL
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
            label: "Clarté des explications de l'intervenant",
            type: 'RADIO',
            required: true,
            options: ['Excellent', 'Bon', 'Moyen', 'Faible'],
            order: 2,
          },
          {
            label: 'Recommanderiez-vous cette matière ?',
            type: 'RADIO',
            required: true,
            options: ['Oui, sans hésiter', 'Oui, avec réserves', 'Non'],
            order: 3,
          },
          {
            label: 'Ce qui pourrait être amélioré',
            type: 'TEXTAREA',
            required: false,
            order: 4,
          },
        ],
      },
    },
  });

  console.log('✅ Global form templates created!');
  console.log(`  - During class form: ${duringFormTemplate.id}`);
  console.log(`  - After class form: ${afterFormTemplate.id}`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });