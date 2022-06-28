import * as crypto from 'crypto';

export const hashPassword = (password: string): string => {

  console.log(password);
  
  const hmac = crypto.createHmac('sha512', process.env.SALT);
  hmac.update(password);

  return hmac.digest('hex');
}