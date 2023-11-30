import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class PasswordsService {
  SECRET_KEY = process.env.HASH_SECRET_KEY;

  public hash(key: string): string {
    return bcrypt.hashSync(key + this.SECRET_KEY, 10);
  }

  public compare(key: string, hashedKey: string): boolean {
    return bcrypt.compareSync(`${key}${this.SECRET_KEY}`, hashedKey);
  }

  public verifyCompare(password: string, hashedPassword: string): boolean {
    const isMatchPassword = this.compare(password, hashedPassword);
    if (!isMatchPassword) {
      throw new UnauthorizedException({
        errorCode: 'PASSWORD_IS_NOT_CORRECT',
        message: 'Password is not correct!',
      });
    }
    return isMatchPassword;
  }
}
