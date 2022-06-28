import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export interface JwtPayload {
  id: string;
}

function cookieExtractor(req: any): null | string {

  return (req && req.cookies) ? (req.cookies?.jwt ?? null) : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
    ) {
      super({
        jwtFromRequest: cookieExtractor,
        secretOrKey: process.env.SECRET
      });
    }
    
  async validate(payload: JwtPayload, done: (error, user) => void) {

    if(!payload || !payload.id) {
      return done(new UnauthorizedException(), false);
    }

    const user = await this.userModel.findOne({ currentToken: payload.id });
    if(!user) done(new UnauthorizedException(), false );

    done(null, user);
  }




}