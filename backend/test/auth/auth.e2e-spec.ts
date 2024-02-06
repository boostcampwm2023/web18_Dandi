import * as request from 'supertest';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { ImagesRepository } from 'src/images/images.repository';

describe('ImagesController (e2e)', () => {
  let app: INestApplication;
  let imagesRepository: ImagesRepository;
  const user = { id: 1, nickname: 'testUser' };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = user;

          return true;
        },
      })
      .compile();

    imagesRepository = module.get<ImagesRepository>(ImagesRepository);
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/login (POST)', () => {
    //TODO: 회원가입 정보가 존재하면, 로그인
    //TODO: 회원가입 정보가 존재하지 않으면, 회원가입 후 로그인
    //TODO: 잘못된 access 요청 시 401
    /**
     * access까지 요청해야함.
     * -> 이전에 fetch api로 거기까지 요청 보내는 것을 구현
     * -> response에서 꺼내서 사용하기
     * -> 로그인과 권한 동의를 어떻게 시킬 것인지...?
     */
  });
});
