import { Injectable } from '@nestjs/common';
import { Response } from 'express';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

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

      const authUser = await this.userModel.findOne({
        "data.email": loginData.email,
        "data.password": hashPassword(loginData.password)
      });

      const userResponse: UserResponseInterface = {
        email: authUser.data.email,
        invested: authUser.invested,
        currentToken: authUser.currentToken,
      }

      res.status(200).cookie('jwt', token.accessToken, {
        secure: false,
        domain: "localhost",
        httpOnly: true,
      });

      return res.json(userResponse);
      
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Server error" })
    }
  }


  async loggedIn(res: Response, user: UserDocument) {

    try {
      
      if(!Types.ObjectId.isValid(user._id)) return res.status(400).json({ ok: false, msg: "Incorrect user ID" });
      const authUser: UserDocument = await this.userModel.findById(user._id);

      const userResponse: UserResponseInterface = {
        email: authUser.data.email,
        invested: authUser.invested,
        currentToken: authUser.currentToken,
      }

      res.status(200).json(userResponse);

    } catch (error) {
      console.log('Error checking if user is logged in');
      console.log(error.message);
      console.log(error);
      res.status(500).json({ ok: false, msg: error.message});
    }
  }


  async logout(res: Response, user: UserDocument) {

    try {

      if(!Types.ObjectId.isValid(user._id)) return res.status(400).json({ ok: false, msg: "Incorrect user ID" });
      const authUser: UserDocument = await this.userModel.findById(user._id);

      authUser.currentToken = null;
      await authUser.save();

      res.clearCookie('jwt', {
        secure: false,
        domain: "localhost",
        httpOnly: true,
      });

      res.status(200).json({ ok: true, msg: "User logged out" });
      
    } catch (error) {
      console.log('Error logging out');
      console.log(error.message);
      console.log(error);
      res.status(500).json({ ok: false, msg: error.message});
    }
  }

}
