import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async createContact(createContactDto: CreateContactDto) {
    const contact = await this.prisma.contact.create({
      data: {
        organization: createContactDto.organization,
        lastName: createContactDto.lastName,
        firstName: createContactDto.firstName,
        email: createContactDto.email,
        phone: createContactDto.phone ?? undefined,
        classCount: createContactDto.classCount,
        message: createContactDto.message ?? undefined,
        wantsCallback: createContactDto.wantsCallback || false,
      },
    });

    return {
      success: true,
      contactId: contact.id,
    };
  }

  async getAllContacts() {
    // Protected route - only admins can access (verification in controller)
    return this.prisma.contact.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
