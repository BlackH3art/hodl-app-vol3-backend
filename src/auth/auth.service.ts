import { Injectable } from '@nestjs/common';
import { Response } from 'express';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';

import { UserLoginInterface, UserResponseInterface } from 'src/interfaces/UserInterface';
import { JwtPayload } from './jwt.strategy';

import { hashPassword } from 'src/utils/hashPassword';
import { sign } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  private createToken(currentToken: string): { accessToken: string, expiresIn: number } {

    const payload: JwtPayload = { id: currentToken };
    const expiresIn: number = 60 * 60 * 24;
    const accessToken = sign(payload, process.env.SECRET, { expiresIn });

    return {
      accessToken,
      expiresIn
    };
  }

  private async generateToken(user: User): Promise<string> {
    let token: string;
    let userWithThisToken: User; 

    try {
      do {
        token = uuid();
        userWithThisToken = await this.userModel.findOne({ currentToken: token })
      } while (!!userWithThisToken);
  
      const authUser = await this.userModel.findOne({ "data.email": user.data.email })
      authUser.currentToken = token;
      await authUser.save();
      
    } catch (error) {
      console.log(error.message);
    }

    return token;
  }


  async login(loginData: UserLoginInterface, res: Response) {

    try {

      const user = await this.userModel.findOne({
        "data.email": loginData.email,
        "data.password": hashPassword(loginData.password)
      });

      if(!user) return res.status(404).json({ msg: "Invalid login or password" });

      const token = await this.createToken( await this.generateToken(user));

      const userResponse: UserResponseInterface = {
        email: user.data.email,
        invested: user.invested,
        transactions: user.transactions,
        history: user.history,
        currentToken: user.currentToken,
        terms: user.terms
      }

      return res.status(200).cookie('jwt', token.accessToken, {
        secure: false, //true jeżeli https
        domain: 'localhost', //domena
        httpOnly: true
      }).json(userResponse);
      
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Server error" })
    }
  }
}
