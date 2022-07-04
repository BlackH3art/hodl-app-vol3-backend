import { createParamDecorator, ExecutionContext} from '@nestjs/common';

export const UserDecorator = createParamDecorator((data, contex: ExecutionContext) => {

  console.log('decorator --> ', contex.switchToHttp().getRequest());
  
  return contex.switchToHttp().getRequest().user;
})