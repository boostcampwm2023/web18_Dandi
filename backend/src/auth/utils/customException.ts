import { HttpException, HttpStatus } from '@nestjs/common';

export class ExpiredTokenException extends HttpException {
  constructor() {
    super('Access Token is Expired', HttpStatus.UNAUTHORIZED);
  }
}
