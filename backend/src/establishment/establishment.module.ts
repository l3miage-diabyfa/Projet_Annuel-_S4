import { Module } from '@nestjs/common';
import { EstablishmentService } from './establishment.service';
import { EstablishmentController } from './establishment.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [EstablishmentController],
    providers: [EstablishmentService, PrismaService],
})
export class EstablishmentModule { }
