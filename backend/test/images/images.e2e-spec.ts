import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ImagesService } from 'src/images/images.service';
import { AppModule } from 'src/app.module';

describe('ImagesController (e2e)', () => {
  let app: INestApplication;
  let imagesService: ImagesService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    imagesService = module.get<ImagesService>(ImagesService);
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
});
