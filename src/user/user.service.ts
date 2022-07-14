import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { ErrorSignUpData } from 'src/interfaces/ErrorSignUpData';
import { UserRegisterInterface } from 'src/interfaces/UserInterface';
import { User } from 'src/schemas/user.schema';
import { hashPassword } from 'src/utils/hashPassword';
import { validateEmail } from 'src/utils/validateEmail';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  private validateSignUpData(signUpData: UserRegisterInterface) {

    const error: ErrorSignUpData = {
      email: [],
      password: [],
      confirmPassword: [],
      terms: ""
    }

    if(signUpData.email === "") error.email.push("Email cannot be empty");
    if(signUpData.password === "") error.password.push("Password cannot be empty");
    if(signUpData.confirmPassword === "") error.confirmPassword.push("Confirm password cannot be empty");
    if(!signUpData.terms) error.terms = "Consent to privacy policy is required";
  
    if(!validateEmail(signUpData.email)) error.email.push("Invalid email address");
    if(signUpData.password.length <= 6) error.password.push("Password must be longer than 6 chars");
    if(signUpData.password !== signUpData.confirmPassword) error.password.push("Passwords are not the same");
    if(signUpData.password !== signUpData.confirmPassword) error.confirmPassword.push("Passwords are not the same");

    return error;
  }
  

  async signUp(newUser: UserRegisterInterface, res: Response): Promise<any> {

    const signUpDataErrors = this.validateSignUpData(newUser);

    if(signUpDataErrors.email.length || signUpDataErrors.password.length || signUpDataErrors.confirmPassword.length || signUpDataErrors.terms !== "") {
      
      return res.status(200).json({ ok: false, msg: "Validation error", data: signUpDataErrors });

    } else {

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







}
