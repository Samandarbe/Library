import { IsOptional, IsString } from 'class-validator';
export class QuizDto {
  @IsString()
  bookName: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  author: string;
}
