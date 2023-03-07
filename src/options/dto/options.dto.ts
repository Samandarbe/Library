import { IsString, IsNumber } from 'class-validator';
export class optionsDto {
  @IsString()
  region: string;

  @IsNumber()
  returnDate: number;
}
