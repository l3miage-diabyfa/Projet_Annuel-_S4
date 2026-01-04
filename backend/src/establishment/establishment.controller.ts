import { Controller, Get } from '@nestjs/common';
import { EstablishmentService } from './establishment.service';

@Controller('establishments')
export class EstablishmentController {
    constructor(private readonly establishmentService: EstablishmentService) { }

    @Get()
    async getAll() {
        //sécuriser la route
        return this.establishmentService.getAllEstablishments();
    }
}
