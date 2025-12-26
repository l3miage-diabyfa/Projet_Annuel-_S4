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
   * Create a review form (TEACHER only)
   */
  @UseGuards(JwtAuthGuard)
  @Post('forms')
  @HttpCode(HttpStatus.CREATED)
  createForm(@Body() dto: CreateReviewFormDto, @Request() req) {
    return this.reviewsService.createReviewForm(dto, req.user.userId);
  }

  /**
   * GET /reviews/forms/class/:classId
   * Get all forms for a class (TEACHER only)
   */
  @UseGuards(JwtAuthGuard)
  @Get('forms/class/:classId')
  getFormsByClass(
    @Param('classId', ParseUUIDPipe) classId: string,
    @Request() req,
  ) {
    return this.reviewsService.getFormsByClass(classId, req.user.userId);
  }

  /**
   * GET /reviews/forms/:formId
   * Get review form (PUBLIC - no auth)
   */
  @Get('forms/:formId')
  getForm(@Param('formId', ParseUUIDPipe) formId: string) {
    return this.reviewsService.getReviewForm(formId);
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
   * Get all responses for a form (TEACHER only)
   */
  @UseGuards(JwtAuthGuard)
  @Get('forms/:formId/responses')
  getResponses(
    @Param('formId', ParseUUIDPipe) formId: string,
    @Request() req,
  ) {
    return this.reviewsService.getReviewsForForm(formId, req.user.userId);
  }
}