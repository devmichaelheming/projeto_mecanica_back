import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Auth, AuthDocument } from './schemas/auth.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(Auth.name)
    private authModel: Model<AuthDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'codingwithabbas',
    });
  }

  async validate(payload) {
    const { id } = payload;

    const auth = await this.authModel.findById(id);

    if (!auth) {
      throw new UnauthorizedException('Login first to access this endpoint.');
    }

    return auth;
  }
}
