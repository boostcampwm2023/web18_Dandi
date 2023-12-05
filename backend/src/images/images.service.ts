import { Injectable } from '@nestjs/common';
import { ImagesRepository } from './images.repository';
import * as sharp from 'sharp';

@Injectable()
export class ImagesService {
  constructor(private readonly imagesRepository: ImagesRepository) {}

  async uploadDiaryImage(userId: number, file: Express.Multer.File) {
    const today = new Date();
    const middlePath = `${today.getFullYear()}/${today.getMonth() + 1}`;

    file = await this.resizeImage(file);

    return await this.imagesRepository.uploadImage(userId, file, middlePath);
  }

  async uploadProfileImage(userId: number, file: Express.Multer.File) {
    file = await this.resizeImage(file);

    return await this.imagesRepository.uploadImage(userId, file, 'profile');
  }

  private async resizeImage(file: Express.Multer.File) {
    file.buffer = await sharp(file.buffer).jpeg({ mozjpeg: true, quality: 80 }).toBuffer();
    file.originalname = file.originalname.split('.')[0];

    return file;
  }
}
