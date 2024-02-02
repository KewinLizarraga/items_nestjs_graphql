import { Injectable } from '@nestjs/common';

import { AuthResponse } from './types/auth-response.type';
import { SignupInput } from './dto/inputs/signup.input';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    const user = await this.userService.create(signupInput);

    const token = '123';

    return {
      token,
      user,
    };
  }
}
