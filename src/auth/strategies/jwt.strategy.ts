import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminModel } from '../admin.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly ConfigService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoresExpiration: false,
      secretOrKey: ConfigService.get('JWT_SECRET'),
    });
  }

  validate({ login }): Pick<AdminModel, 'login'> {
    return login;
  }
}
