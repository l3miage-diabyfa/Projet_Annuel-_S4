import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  getHello(): string {
    return 'Backend is running! 🚀';
  }

  @Get('health')
  async healthCheck() {
    try {
      // Try to query the database
      const userCount = await this.prisma.user.count();
      const classCount = await this.prisma.class.count();

      return {
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString(),
        stats: {
          users: userCount,
          classes: classCount,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        database: 'disconnected',
        error: error.message,
      };
    }
  }
}
