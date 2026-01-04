import { IsUUID, IsNotEmpty } from 'class-validator';

export class AddStudentDto {
  @IsUUID('4')
  @IsNotEmpty()
  studentId: string;
}