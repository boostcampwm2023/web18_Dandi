export const JWT = 'jwt';

export interface Payload {
  id: number;
  nickname: string;
  accessToken: string;
  iat: number;
}

export const JWT_EXPIRED_ERROR = 'TokenExpiredError';
