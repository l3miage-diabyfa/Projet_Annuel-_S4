import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Ip,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewFormDto } from './dto/create-review-form.dto';
import { SubmitReviewDto } from './dto/submit-review.dto';
import { JwtAuthGuard } from '../user/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * POST /reviews/forms
   * Create a review form (TEACHER/ADMIN only)
   */
  @UseGuards(JwtAuthGuard)
  @Post('forms')
  @HttpCode(HttpStatus.CREATED)
  createForm(@Body() dto: CreateReviewFormDto, @Request() req) {
    return this.reviewsService.createReviewForm(dto, req.user.userId);
  }

  /**
   * GET /reviews/forms/class/:classId
   * Get all forms for a class (for modal selection)
   */
  @UseGuards(JwtAuthGuard)
  @Get('forms/class/:classId')
  getFormsForClass(@Param('classId', ParseUUIDPipe) classId: string) {
    return this.reviewsService.getFormsForClass(classId);
  }

  /**
   * GET /reviews/forms/:formId
   * Get review form by ID (PUBLIC - no auth)
   */
  @Get('forms/:formId')
  getForm(@Param('formId', ParseUUIDPipe) formId: string) {
    return this.reviewsService.getReviewForm(formId);
  }

  /**
   * GET /reviews/public/:publicLink
   * Get review form by public link (PUBLIC - no auth)
   */
  @Get('public/:publicLink')
  getFormByPublicLink(@Param('publicLink') publicLink: string) {
    return this.reviewsService.getReviewFormByPublicLink(publicLink);
  }

  /**
   * POST /reviews/submit
   * Submit a review (PUBLIC - no auth required)
   */
  @Post('submit')
  @HttpCode(HttpStatus.CREATED)
  submitReview(@Body() dto: SubmitReviewDto, @Ip() ip: string) {
    return this.reviewsService.submitReview(dto, undefined, ip);
  }

  /**
   * GET /reviews/forms/:formId/responses
   * Get all responses for a form (TEACHER/ADMIN only)
   */
  @UseGuards(JwtAuthGuard)
  @Get('forms/:formId/responses')
  getResponses(
    @Param('formId', ParseUUIDPipe) formId: string,
    @Request() req,
  ) {
    return this.reviewsService.getReviewsForForm(formId, req.user.userId);
  }

  /**
   * GET /reviews/forms/:formId/has-responses
   * Check if form has responses
   */
  @UseGuards(JwtAuthGuard)
  @Get('forms/:formId/has-responses')
  hasResponses(@Param('formId') formId: string) {
    return this.reviewsService.hasResponses(formId);
  }

  /**
   * GET /reviews/forms/:formId/responses-stats
   * Get responses with statistics
   */
  @UseGuards(JwtAuthGuard)
  @Get('forms/:formId/responses-stats')
  getResponsesWithStats(
    @Param('formId') formId: string,
    @Request() req,
  ) {
    return this.reviewsService.getFormResponsesWithStats(formId, req.user.userId);
  }

  /**
   * POST /reviews/forms/:formId/send-reminder
   * Send reminder emails
   */
  @UseGuards(JwtAuthGuard)
  @Post('forms/:formId/send-reminder')
  sendReminder(
    @Param('formId') formId: string,
    @Body() body: { classId: string },
    @Request() req,
  ) {
    return this.reviewsService.sendReminderEmails(formId, body.classId, req.user.userId);
  }

  /**
   * GET /reviews/forms/:formId/export
   * Export responses (CSV/Excel)
   */
  @UseGuards(JwtAuthGuard)
  @Get('forms/:formId/export')
  exportResponses(
    @Param('formId') formId: string,
    @Query('format') format: 'csv' | 'excel',
    @Request() req,
  ) {
    return this.reviewsService.exportResponses(formId, format, req.user.userId);
  }
}