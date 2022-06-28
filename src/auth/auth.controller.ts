import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserLoginInterface } from 'src/interfaces/UserInterface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(
    @Inject(AuthService) private authService: AuthService,
  ) {}


  @Post('/login')
  async signIn(
    @Body() loginData: UserLoginInterface,
    @Res() res: Response
  ): Promise<any> {
    return this.authService.login(loginData, res);
  }
  
}
