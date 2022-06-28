import { Controller, Inject } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

  constructor(
    @Inject(UserService) private userService: UserService,
  ) {}

  
}
