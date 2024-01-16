import { IsMongoId, IsNotEmpty } from 'class-validator';

export class FindManyCoursesQuery {
  @IsNotEmpty()
  @IsMongoId()
  courseCategoryId: string;
}
