import {
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/users/utils/user.decorator';
import { User as UserEntity } from 'src/users/entity/user.entity';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IMAGE_TYPE_REGEX } from './utils/images.constant';

@ApiTags('Image API')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('/diaries')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ description: '다이어리 이미지 업로드 API' })
  @ApiCreatedResponse({ description: '이미지 업로드 성공' })
  async uploadDiaryImage(
    @User() user: UserEntity,
    @UploadedFile(
      new ParseFilePipe({ validators: [new FileTypeValidator({ fileType: IMAGE_TYPE_REGEX })] }),
    )
    file: Express.Multer.File,
  ): Promise<Record<string, string>> {
    const uploadedFile = await this.imagesService.uploadDiaryImage(user.id, file);

    return { imageURL: uploadedFile.Location };
  }

  @Post('/profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ description: '프로필 이미지 업로드 API' })
  @ApiCreatedResponse({ description: '이미지 업로드 성공' })
  async uploadProfileImage(
    @User() user: UserEntity,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: IMAGE_TYPE_REGEX })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<Record<string, string>> {
    const uploadedFile = await this.imagesService.uploadProfileImage(user.id, file);

    return { imageURL: uploadedFile.Location };
  }
}
