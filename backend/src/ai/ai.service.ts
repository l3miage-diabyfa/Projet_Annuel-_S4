import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private openai: OpenAI;

  constructor() {
    // Initialiser OpenAI avec la clé API depuis les variables d'environnement
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Génère une synthèse des avis étudiants pour un cours
   * @param reviews - Liste des avis à analyser
   * @returns Synthèse générée par l'IA
   */
  async generateSummary(reviews: Array<{ rating: number; comment?: string }>): Promise<string> {
    try {
      // Préparer le contenu des avis
      const reviewsContent = reviews
        .map((review, index) => {
          const comment = review.comment || 'Pas de commentaire';
          return `Avis ${index + 1} (Note: ${review.rating}/5): ${comment}`;
        })
        .join('\n');

      const prompt = `Tu es un assistant pédagogique analysant des avis d'étudiants sur un cours.

Analyse ces ${reviews.length} avis et génère une synthèse en français de 150 mots maximum.

Identifie :
- Les points positifs récurrents
- Les difficultés mentionnées  
- Les suggestions d'amélioration

Avis à analyser :
${reviewsContent}

Synthèse :`;

      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant pédagogique expert dans l\'analyse de feedback étudiant.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      });

      const summary = completion.choices[0]?.message?.content || 'Impossible de générer une synthèse.';
      
      this.logger.log(`Synthèse générée pour ${reviews.length} avis`);
      return summary;
    } catch (error) {
      this.logger.error('Erreur lors de la génération de la synthèse:', error);
      throw new Error('Impossible de générer la synthèse avec l\'IA');
    }
  }

  /**
   * Détecte des alertes basées sur les avis récents
   * @param reviews - Liste des avis récents à analyser
   * @returns Alerte détectée (null si aucune alerte)
   */
  async detectAlert(
    reviews: Array<{ rating: number; comment?: string; createdAt: Date }>,
  ): Promise<{
    hasAlert: boolean;
    type: 'negative' | 'positive' | null;
    severity: 'low' | 'medium' | 'high';
    title: string;
    description: string;
  } | null> {
    try {
      // Filtrer les avis récents (derniers 7 jours)
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const recentReviews = reviews.filter(review => review.createdAt >= sevenDaysAgo);

      if (recentReviews.length === 0) {
        return null;
      }

      // Préparer le contenu
      const reviewsContent = recentReviews
        .map((review, index) => {
          const comment = review.comment || 'Pas de commentaire';
          return `Avis ${index + 1} (Note: ${review.rating}/5): ${comment}`;
        })
        .join('\n');

      const prompt = `Analyse ces avis d'étudiants récents et détermine s'il y a une alerte à signaler.

Critères d'alerte NÉGATIVE :
- Plusieurs notes ≤ 2/5
- Mots-clés négatifs répétés (difficile, incompréhensible, trop rapide, etc.)
- Plaintes récurrentes sur un même aspect

Critères d'alerte POSITIVE :
- Plusieurs notes = 5/5
- Commentaires très positifs
- Progression notable

Réponds UNIQUEMENT en JSON valide (sans markdown) :
{
  "hasAlert": true ou false,
  "type": "negative" ou "positive" ou null,
  "severity": "low" ou "medium" ou "high",
  "title": "Titre court de l'alerte",
  "description": "Description en une phrase"
}

Avis récents (${recentReviews.length}) :
${reviewsContent}`;

      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu es un système de détection d\'alertes pour analyser le sentiment des étudiants. Réponds uniquement en JSON valide.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3, // Plus bas pour des réponses plus déterministes
        max_tokens: 200,
        response_format: { type: 'json_object' },
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        return null;
      }

      const alert = JSON.parse(responseContent);

      this.logger.log(`Détection d'alerte: ${alert.hasAlert ? alert.type : 'aucune'}`);
      
      return alert.hasAlert ? alert : null;
    } catch (error) {
      this.logger.error('Erreur lors de la détection d\'alerte:', error);
      throw new Error('Impossible de détecter les alertes avec l\'IA');
    }
  }

  /**
   * Génère un message personnalisé pour les étudiants basé sur une alerte
   * @param alert - L'alerte détectée
   * @param courseName - Nom du cours
   * @param teacherName - Nom de l'enseignant
   * @returns Message généré (objet + corps du message)
   */
  async generateStudentMessage(
    alert: {
      type: 'negative' | 'positive';
      severity: string;
      title: string;
      description: string;
    },
    courseName: string,
    teacherName: string,
  ): Promise<{ subject: string; message: string }> {
    try {
      const prompt = `Tu es un enseignant bienveillant qui répond aux préoccupations des étudiants.

Contexte :
- Cours : ${courseName}
- Enseignant : ${teacherName}
- Type d'alerte : ${alert.type}
- Description : ${alert.description}

Génère un message pour les étudiants en JSON :
{
  "subject": "Objet du message (max 50 caractères)",
  "message": "Corps du message (200-300 mots, format paragraphes avec \\n\\n, ton bienveillant et constructif)"
}

${alert.type === 'negative' ? 'Le message doit reconnaître les difficultés, proposer des solutions concrètes et encourager les étudiants.' : 'Le message doit féliciter les étudiants, reconnaître leurs efforts et les encourager à continuer.'}`;

      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant pédagogique qui aide les enseignants à communiquer efficacement avec leurs étudiants.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 500,
        response_format: { type: 'json_object' },
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error('Pas de réponse de l\'IA');
      }

      const result = JSON.parse(responseContent);
      
      this.logger.log(`Message généré pour alerte ${alert.type}`);
      return result;
    } catch (error) {
      this.logger.error('Erreur lors de la génération du message:', error);
      throw new Error('Impossible de générer le message avec l\'IA');
    }
  }

  /**
   * Teste la connexion à l'API OpenAI
   * @returns true si la connexion fonctionne
   */
  async testConnection(): Promise<boolean> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Test' }],
        max_tokens: 5,
      });
      
      this.logger.log('Connexion OpenAI OK');
      return !!completion.choices[0]?.message?.content;
    } catch (error) {
      this.logger.error('Erreur de connexion OpenAI:', error);
      return false;
    }
  }
}
