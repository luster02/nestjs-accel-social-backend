import { UnauthorizedException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { IJwtPayload } from '../interfaces';
import { User } from '@user/schemas/user.schema'
import { IEnvironmentVariables } from '@config/config.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly _configService: ConfigService<IEnvironmentVariables>,
    @InjectModel('User')
    private readonly userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: IJwtPayload) {
    const { username } = payload;
    const user = await this.userModel.findOne({ username });
    if (!user) throw new UnauthorizedException();
    return payload;
  }
  
}
