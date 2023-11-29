import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { objectStorageConfig } from 'src/configs/objectStorage.config';
import { OBJECT_STORAGE_BUCKET } from '../diaries/utils/diaries.constant';

@Injectable()
export class ImagesRepository {
  private readonly s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3(objectStorageConfig);
  }

  uploadDiaryImage(userId: number, file: Express.Multer.File, middlePath: string) {
    return this.s3
      .upload({
        Bucket: OBJECT_STORAGE_BUCKET,
        Key: `${userId}/${middlePath}/${file.originalname}`,
        ACL: 'public-read',
        Body: file.buffer,
        ContentType: file.mimetype,
      })
      .promise();
  }
}
