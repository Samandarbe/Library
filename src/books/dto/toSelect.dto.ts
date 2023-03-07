import { IsMongoId, IsString, isString } from 'class-validator';

export class toSelectDto {
  @IsString()
  bookId: string;

  @IsMongoId()
  userId: string;
}
