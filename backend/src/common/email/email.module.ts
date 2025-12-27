import { Module } from '@nestjs/common';
import { SenderService } from './sender.service';
import { TemplateService } from './template.service';
import { EmailService } from './email.service';

@Module({
  providers: [SenderService, TemplateService, EmailService],
  exports: [EmailService],
})
export class EmailModule {}
