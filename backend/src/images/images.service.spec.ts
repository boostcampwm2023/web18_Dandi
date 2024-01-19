import { Test, TestingModule } from '@nestjs/testing';
import { ImagesService } from './images.service';
import { ImagesRepository } from './images.repository';
import * as fs from 'fs';
import { ManagedUpload } from 'aws-sdk/clients/s3';

jest.mock('./images.repository');

describe('FriendsService Test', () => {
  let imagesService: ImagesService;
  let imagesRepository: ImagesRepository;

  const buffer = fs.readFileSync('./test/testImage.png');
  const originalname = 'testImage.jpeg';
  const file = { originalname, buffer } as Express.Multer.File;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImagesService, ImagesRepository],
    }).compile();

    imagesService = module.get<ImagesService>(ImagesService);
    imagesRepository = module.get<ImagesRepository>(ImagesRepository);
  });

  describe('일기 이미지 업로드 테스트', () => {
    beforeEach(() => jest.clearAllMocks());

    it('일기 이미지 정상 업로드', async () => {
      //given
      const userId = 1;
      const date = new Date();
      const data = {
        Location: `https://dandi-object-storage.kr.object.ncloudstorage.com/${userId}/${date.getFullYear()}/${date.getMonth()}/${originalname}`,
      } as ManagedUpload.SendData;

      (imagesRepository.uploadImage as jest.Mock).mockResolvedValue(data);

      //when
      const result = await imagesService.uploadDiaryImage(userId, file);

      //then
      expect(imagesRepository.uploadImage).toHaveBeenCalledTimes(1);
      expect(result.Location).toEqual(data.Location);
    });
  });

  describe('프로필 이미지 업로드 테스트', () => {
    beforeEach(() => jest.clearAllMocks());

    it('프로필 이미지 정상 업로드', async () => {
      //given
      const userId = 1;
      const data = {
        Location: `https://dandi-object-storage.kr.object.ncloudstorage.com/${userId}/profile/${originalname}`,
      } as ManagedUpload.SendData;

      (imagesRepository.uploadImage as jest.Mock).mockResolvedValue(data);

      //when
      const result = await imagesService.uploadDiaryImage(userId, file);

      //then
      expect(imagesRepository.uploadImage).toHaveBeenCalledTimes(1);
      expect(result.Location).toEqual(data.Location);
    });
  });
});
