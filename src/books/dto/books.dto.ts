import { IsString, IsNumber, IsOptional } from 'class-validator';
export class BooksDto {
  @IsString()
  timeOfWriting: string;

  @IsString()
  inventoryNumber: string;

  @IsString()
  author: string;

  @IsString()
  title: string;

  @IsString()
  yearOfPublication: string;

  @IsString()
  department: string;

  @IsString()
  @IsOptional()
  note: string;

  @IsString()
  @IsOptional()
  url: string;

  @IsNumber()
  totalCount: number;

  @IsNumber()
  @IsOptional()
  busyCount: number;

  @IsNumber()
  @IsOptional()
  manyBooksRead: number;

  @IsOptional()
  @IsString()
  photo: string;
}
