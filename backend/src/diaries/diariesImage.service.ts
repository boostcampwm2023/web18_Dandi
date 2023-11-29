import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { objectStorageConfig } from 'src/configs/objectStorage.config';
import { OBJECT_STORAGE_BUCKET } from './utils/diaries.constant';

@Injectable()
export class DiariesImageService {
  private readonly s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3(objectStorageConfig);
  }

  async uploadImage(userId: number, file: Express.Multer.File) {
    const today = new Date();

    return await this.s3
      .upload({
        Bucket: OBJECT_STORAGE_BUCKET,
        Key: `${userId}/${today.getFullYear()}/${today.getMonth() + 1}/${file.originalname}`,
        ACL: 'public-read',
        Body: file.buffer,
        ContentType: file.mimetype,
      })
      .promise();
  }
}
