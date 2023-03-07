import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { AdminModel } from 'src/auth/admin.model';
import { AdminDto } from './dto/admin.dto';
import { genSalt, hashSync, compare } from 'bcryptjs';
import { ADMIN_NOT_FOUND, WRONG_PASSWORD } from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AdminModel) private readonly adminModel: ModelType<AdminModel>,
    private readonly JwtService: JwtService,
  ) {}
  async createAdmin(dto: AdminDto) {
    const salt = await genSalt(10);
    const user = await this.adminModel.create({
      login: dto.login,
      password: hashSync(dto.password, salt),
    });
    return user;
  }

  async findAdmin(login: string) {
    return this.adminModel.findOne({ login }).exec();
  }

  async validationAdmin(dto: AdminDto): Promise<Pick<AdminDto, 'login'>> {
    const user = await this.findAdmin(dto.login);
    if (!user) {
      throw new UnauthorizedException(ADMIN_NOT_FOUND);
    }
    const isCorrectPassword = await compare(dto.password, user.password);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD);
    }
    return { login: dto.login };
  }

  async login(login: string) {
    const payload = { login };
    return {
      access_token: await this.JwtService.signAsync(payload),
    };
  }
}
