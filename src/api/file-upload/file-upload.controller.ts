import { ApiPublic } from '@/decorators/http.decorators';
import { Controller, ParseFilePipe, Post, UploadedFiles } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UploadMultipleFields } from './file-upload.decorator';
import { FileUploadService } from './file-upload.service';

@ApiTags('Uploads')
@Controller({ path: 'file-uploads', version: '1' })
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload')
  @ApiPublic()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
        banner: {
          type: 'string',
          format: 'binary',
        },
        gallery: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UploadMultipleFields([
    { name: 'avatar', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
    { name: 'gallery', maxCount: 20 },
    { name: 'file', maxCount: 1 },
  ])
  async upload(
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: false,
      }),
    )
    files: {
      avatar?: Express.Multer.File[];
      banner?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
      file?: Express.Multer.File[];
    },
  ) {
    const result = {};

    if (files.file) {
      result['file'] = await this.fileUploadService.uploadFile(files.file[0], {
        allowedMimeTypes: ['text/plain'],
        rename: false,
        folder: 'files',
        maxFileSize: 10 * 1024 * 1024,
      });
    }

    if (files.avatar) {
      result['avatar'] = await this.fileUploadService.upload(files.avatar[0], {
        folder: 'avatar',
        format: 'webp',
        quality: 85,
        generateThumbnail: true,
        withName: '12-crodic-avatar',
      });
    }

    if (files.banner) {
      result['banner'] = await this.fileUploadService.upload(files.banner[0], {
        folder: 'banner',
        format: 'webp',
        quality: 75,
      });
    }

    if (files.gallery) {
      result['gallery'] = await Promise.all(
        files.gallery.map((file) =>
          this.fileUploadService.upload(file, {
            folder: 'gallery',
            format: 'webp',
            quality: 80,
            generateThumbnail: true,
          }),
        ),
      );
    }

    return { success: true, data: result };
  }
}
