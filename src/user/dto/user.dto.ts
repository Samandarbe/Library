import {
  IsString,
  IsArray,
  IsOptional,
  IsEnum,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

export enum Nationality {
  Uzb = 'Uzb',
  Rus = 'Rus',
}
export class UserDto {
  @IsString()
  firstName: string;

  @IsNumber()
  @IsOptional()
  userManyBooksRead: number;

  @IsString()
  lastName: string;

  @IsString()
  patronymic: string;

  @IsEnum(Nationality)
  nationality: Nationality;

  @IsString()
  dob: string;

  @IsString()
  workPlace: string;

  @IsString()
  profession: string;

  @IsString()
  placeStudy: string;

  @IsString()
  address: string;

  photo: string;

  @IsString()
  phone: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readBooks: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  selectedBooks: string[];

  @IsString()
  @IsOptional()
  id: string;
}
