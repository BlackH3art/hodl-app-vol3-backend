import { Body, Controller, Get, Inject, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UserDecorator } from 'src/decorators/user.decorator';
import { UserLoginInterface } from 'src/interfaces/UserInterface';
import { UserDocument } from 'src/schemas/user.schema';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(
    @Inject(AuthService) private authService: AuthService,
  ) {}


  @Post('/login')
  signIn(
    @Body() loginData: UserLoginInterface,
    @Res() res: Response
  ): Promise<any> {
    return this.authService.login(loginData, res);
  }

  @Get('/loggedin')
  @UseGuards(AuthGuard('jwt'))
  loggedIn(
    @Res() res: Response,
    @UserDecorator() user: UserDocument,
  ): Promise<any> {
    return this.authService.loggedIn(res, user);
  }
  
}
