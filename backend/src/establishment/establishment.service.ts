import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EstablishmentService {
    constructor(private readonly prisma: PrismaService) { }

    async getAllEstablishments() {
        //sécuriser la route
        return this.prisma.establishment.findMany();
    }
}
