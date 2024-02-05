import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT } from 'src/auth/utils/jwt.type';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class TestAuthGuard extends AuthGuard(JWT) {
  constructor(private readonly user: User) {
    super();
  }

  canActivate(context: ExecutionContext) {
    context.switchToHttp().getRequest().user = this.user;

    return true;
  }
}
