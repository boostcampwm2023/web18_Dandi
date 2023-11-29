import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ImagesService } from './images.service';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/users/utils/user.decorator';
import { User as UserEntity } from 'src/users/entity/user.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Image API')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('/diaries')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @User() user: UserEntity,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Record<string, string>> {
    const uploadedFile = await this.imagesService.uploadDiaryImage(user.id, file);

    return { imageURL: uploadedFile.Location };
  }
}
