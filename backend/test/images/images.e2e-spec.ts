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

  describe('/images/diaries (POST)', () => {
    const url = '/images/diaries';

    it('이미지 정상 업로드', async () => {
      // given
      const imageFilePath = './test/testImage.png';
      const uploadedLocation = `https://dandi-object-storage.kr.object.ncloudstorage.com/${user.id}/2024/01/testImage.png`;
      imagesRepository.uploadImage = jest.fn();
      (imagesRepository.uploadImage as jest.Mock).mockReturnValue({ Location: uploadedLocation });

      // when
      const response = await request(app.getHttpServer()).post(url).attach('image', imageFilePath);

      // then
      expect(response.status).toEqual(201);
      expect(response.body.imageURL).toEqual(uploadedLocation);
    });

    it('파일의 MIME type이 맞지 않는 경우 예외 발생', async () => {
      // given
      const imageFilePath = './test/images/testFile.txt';

      // when
      const response = await request(app.getHttpServer()).post(url).attach('image', imageFilePath);

      // then
      expect(response.status).toEqual(400);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
