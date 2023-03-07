import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AdminDto } from 'src/auth/dto/admin.dto';
import { ALREADY_REGISTER_ERROR } from './auth.constants';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AdminDto) {
    const oldUser = await this.authService.findAdmin(dto.login);

    if (oldUser) {
      throw new BadRequestException(ALREADY_REGISTER_ERROR);
    }

    return this.authService.createAdmin(dto);
  }

  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(@Body() dto: AdminDto) {
    const user = await this.authService.validationAdmin(dto);
    return this.authService.login(dto.login);
  }
}
