import { IsNumber, IsString } from 'class-validator';
export class UpdateSelectBooksDto {
  @IsNumber()
  returnDate: number;
  @IsString()
  id: string;
}
