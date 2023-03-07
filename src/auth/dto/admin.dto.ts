import { IsString } from 'class-validator';

export class AdminDto {
  @IsString()
  login: string;

  @IsString()
  password: string;
}
