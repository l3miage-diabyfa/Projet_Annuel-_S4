import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Header,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { ImportSubjectsCsvDto } from './dto/import-subjects-csv.dto';
import { JwtAuthGuard } from '../user/jwt-auth.guard';
import { AttachFormsDto } from './dto/attach-forms.dto';

@Controller('subjects')
@UseGuards(JwtAuthGuard) // All routes require authentication
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  /**
   * POST /subjects
   * Create a new subject (manual creation)
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createSubjectDto: CreateSubjectDto, @Request() req) {
    return this.subjectsService.create(createSubjectDto, req.user.userId);
  }

  /**
   * POST /subjects/import-csv
   * Import multiple subjects from CSV
   */
  @Post('import-csv')
  @HttpCode(HttpStatus.CREATED)
  importFromCsv(@Body() importDto: ImportSubjectsCsvDto, @Request() req) {
    return this.subjectsService.importFromCsv(importDto, req.user.userId);
  }

  /**
   * GET /subjects/csv-template
   * Download CSV template
   */
  @Get('csv-template')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="import_matieres.csv"')
  downloadCsvTemplate() {
    return this.subjectsService.generateCsvTemplate();
  }

  /**
   * GET /subjects/class/:classId
   * Get all subjects for a specific class
   */
  @Get('class/:classId')
  findByClass(
    @Param('classId', ParseUUIDPipe) classId: string,
    @Request() req,
  ) {
    return this.subjectsService.findByClass(classId, req.user.userId);
  }

  /**
   * GET /subjects/:id
   * Get a specific subject by ID
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.subjectsService.findOne(id, req.user.userId);
  }

  /**
   * PATCH /subjects/:id
   * Update a subject
   */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
    @Request() req,
  ) {
    return this.subjectsService.update(id, updateSubjectDto, req.user.userId);
  }

  /**
   * DELETE /subjects/:id
   * Delete a subject
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.subjectsService.remove(id, req.user.userId);
  }
  // Attach review forms to subject
  @Patch(':id/attach-forms')
  @UseGuards(JwtAuthGuard)
  async attachReviewForms(
    @Param('id') id: string,
    @Body() dto: AttachFormsDto,
    @Request() req,
  ) {
    return this.subjectsService.attachReviewForms(id, dto, req.user.userId);
  }

  // Get subject with form statistics
  @Get(':id/with-stats')
  @UseGuards(JwtAuthGuard)
  async getSubjectWithStats(
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.subjectsService.getSubjectWithFormStats(id, req.user.userId);
  }
}