import { User } from 'src/users/entity/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { JWT_EXPIRE_DATE } from 'src/auth/utils/auth.constant';

const jwtService = new JwtService({
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: JWT_EXPIRE_DATE,
  },
});

const expiredJwtService = new JwtService({
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: 0,
  },
});

// accessToken 반환만을 위한 로그인 함수
export const testLogin = async (user: User) => {
  const accessKey = uuidv4();

  return jwtService.sign({
    id: user.id,
    nickname: user.nickname,
    accessKey,
  });
};

export const getExpiredJwtToken = async (user: User) => {
  const accessKey = uuidv4();
  const token = expiredJwtService.sign({
    id: user.id,
    nickname: user.nickname,
    accessKey,
  });

  return { accessKey, token };
};
