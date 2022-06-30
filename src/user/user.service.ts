import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { UserRegisterInterface } from 'src/interfaces/UserInterface';
import { User } from 'src/schemas/user.schema';
import { hashPassword } from 'src/utils/hashPassword';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}
  

  async signUp(newUser: UserRegisterInterface, res: Response): Promise<any> {

    try {
      const login = await this.userModel.findOne({ "data.email": newUser.email });

      const passwordHash = hashPassword(newUser.password);
      const confirmPasswordHash = hashPassword(newUser.confirmPassword);
      
      if(login) return res.status(400).json({ ok: false, msg: "Account already exists" });
      if(passwordHash !== confirmPasswordHash) return res.status(400).json({ ok: false, msg: "Passwords are not the same" });

      await this.userModel.create({
        data: {
          email: newUser.email,
          password: passwordHash
        }
      });

      return res.status(201).json({ ok: true, msg: "User registered" });

    } catch (error) {

      console.log('Error signUp', error.message);
      res.status(500).json({ ok: false, msg: "Something went wrong"});
    }
  }







}
