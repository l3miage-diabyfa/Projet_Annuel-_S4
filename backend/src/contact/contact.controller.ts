import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { JwtAuthGuard } from '../user/jwt-auth.guard';
import { AdminRoleGuard } from '../user/admin-role.guard';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiOperation({ summary: 'Envoyer une demande de contact' })
  @ApiResponse({ status: 201, description: 'Demande envoyée avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  async createContact(@Body() createContactDto: CreateContactDto) {
    return this.contactService.createContact(createContactDto);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Récupérer tous les messages de contact (Admin uniquement)' })
  @ApiResponse({ status: 200, description: 'Liste des messages récupérée avec succès.' })
  @ApiResponse({ status: 403, description: 'Accès interdit - réservé aux administrateurs.' })
  async getAllContacts() {
    return this.contactService.getAllContacts();
  }
}
