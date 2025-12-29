import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ClassesModule } from './classes/classes.module';
import { UserModule } from './user/user.module';
import { EstablishmentModule } from './establishment/establishment.module';
import { SubjectsModule } from './subjects/subjects.module';
import { EmailModule } from './common/email/email.module';
import { ContactModule } from './contact/contact.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AIModule } from './ai/ai.module';

@Module({
  imports: [
    PrismaModule,
    ClassesModule,
    UserModule,
    EstablishmentModule,
    SubjectsModule,
    EmailModule,
    ContactModule,
    ReviewsModule,
    AIModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}