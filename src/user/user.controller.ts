import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserRegisterInterface } from 'src/interfaces/UserInterface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

  constructor(
    @Inject(UserService) private userService: UserService,
  ) {}

  
  @Post('/register')
  registerNewUser(
    @Body() newUserData: UserRegisterInterface,
    @Res() res: Response
  ): Promise<any> {
    return this.userService.signUp(newUserData, res);
  }
}
