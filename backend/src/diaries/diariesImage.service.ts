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

  async uploadImage(file) {
    return await this.s3
      .putObject({
        Bucket: OBJECT_STORAGE_BUCKET,
        Key: 'test',
        ACL: 'public-read',
        // ACL을 지우면 전체 공개되지 않습니다.
        Body: file.buffer,
        // ContentType: file.mimetype,
      })
      .promise();
  }
}
