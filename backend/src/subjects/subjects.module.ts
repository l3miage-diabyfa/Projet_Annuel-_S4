import { Module } from '@nestjs/common';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';
import { ReviewSchedulerService } from './review-scheduler.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailModule } from '../common/email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [SubjectsController],
  providers: [SubjectsService, ReviewSchedulerService, PrismaService],
  exports: [SubjectsService],
})
export class SubjectsModule {}