import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { AddStudentDto } from './dto/add-student.dto';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  /**
   * POST /classes
   * Create a new class
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  /**
   * GET /classes
   * Get all classes (optionally filter by teacherId)
   */
  @Get()
  findAll(@Query('teacherId') teacherId?: string) {
    return this.classesService.findAll(teacherId);
  }

  /**
   * GET /classes/teacher/:teacherId
   * Get all classes for a specific teacher
   */
  @Get('teacher/:teacherId')
  findByTeacher(@Param('teacherId', ParseUUIDPipe) teacherId: string) {
    return this.classesService.findByTeacher(teacherId);
  }

  /**
   * GET /classes/:id
   * Get a specific class by ID
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.classesService.findOne(id);
  }

  /**
   * GET /classes/:id/statistics
   * Get statistics for a specific class
   */
  @Get(':id/statistics')
  getStatistics(@Param('id', ParseUUIDPipe) id: string) {
    return this.classesService.getStatistics(id);
  }

  /**
   * PATCH /classes/:id
   * Update a class
   */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    return this.classesService.update(id, updateClassDto);
  }

  /**
   * DELETE /classes/:id
   * Delete a class
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.classesService.remove(id);
  }

  /**
   * POST /classes/:classId/students
   * Add a student to a class
   */
  @Post(':classId/students')
  @HttpCode(HttpStatus.CREATED)
  addStudent(
    @Param('classId', ParseUUIDPipe) classId: string,
    @Body() addStudentDto: AddStudentDto,
  ) {
    return this.classesService.addStudent(classId, addStudentDto.studentId);
  }

  /**
   * DELETE /classes/:classId/students/:studentId
   * Remove a student from a class
   */
  @Delete(':classId/students/:studentId')
  @HttpCode(HttpStatus.OK)
  removeStudent(
    @Param('classId', ParseUUIDPipe) classId: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ) {
    return this.classesService.removeStudent(classId, studentId);
  }
}