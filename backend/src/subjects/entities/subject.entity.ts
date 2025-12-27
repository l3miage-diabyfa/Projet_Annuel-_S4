export class Subject {
  id: string;
  name: string;
  instructorName: string | null;
  instructorEmail: string | null;
  firstLessonDate: Date | null;
  lastLessonDate: Date | null;
  classId: string;
  createdAt: Date;
  updatedAt: Date;
}