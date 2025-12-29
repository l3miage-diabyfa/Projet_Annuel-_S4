import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AIService } from './ai/ai.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly aiService: AIService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('test-ai')
  async testAI() {
    try {
      const isConnected = await this.aiService.testConnection();
      return {
        success: true,
        connected: isConnected,
        message: isConnected
          ? 'OpenAI est connecté et fonctionne'
          : 'OpenAI ne répond pas correctement',
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        connected: false,
        message: 'Erreur lors du test OpenAI',
        error: error.message,
        tip: 'Vérifiez que OPENAI_API_KEY est bien configuré dans .env',
      };
    }
  }
  @Get('test-summary')
  async testSummary() {
    try {
      const testReviews = [
        { rating: 5, comment: 'Excellent cours, très clair et bien structuré !' },
        { rating: 4, comment: 'Bon cours mais un peu rapide sur certains concepts' },
        { rating: 2, comment: 'Difficile à suivre, trop théorique' },
      ];

      const summary = await this.aiService.generateSummary(testReviews);

      return {
        success: true,
        message: 'Synthèse générée avec succès',
        input: {
          reviewCount: testReviews.length,
          averageRating: (
            testReviews.reduce((sum, r) => sum + r.rating, 0) / testReviews.length
          ).toFixed(1),
        },
        output: {
          summary,
          wordCount: summary.split(' ').length,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de la génération de la synthèse',
        error: error.message,
      };
    }
  }
}
