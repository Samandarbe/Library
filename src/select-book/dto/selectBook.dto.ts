import {
  IsDate,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
export class SelectBooksDto {
  @IsNumber()
  returnDate: Date;

  @IsMongoId()
  user: string;

  @IsString()
  @IsOptional()
  id: string;

  @IsMongoId()
  book: string;

  @IsDate()
  @IsOptional()
  givenDate: number;
}
