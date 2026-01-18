import { Global, Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';

@Global()
@Module({
  providers: [FileUploadService],
  exports: [FileUploadService],
  controllers: [FileUploadController],
})
export class FileUploadModule {}

// @Controller('media')
// export class MediaController {
//   constructor(private readonly fileUploadService: FileUploadService) {}

//   @Post('upload')
//   @UploadMultipleFields([
//     { name: 'avatar', maxCount: 1 },
//     { name: 'banner', maxCount: 1 },
//     { name: 'gallery', maxCount: 20 },
//   ])
//   async upload(
//     @UploadedFiles()
//     files: {
//       avatar?: Express.Multer.File[];
//       banner?: Express.Multer.File[];
//       gallery?: Express.Multer.File[];
//     },
//   ) {
//     const result = {};

//     if (files.avatar) {
//       result['avatar'] = await this.fileUploadService.upload(files.avatar[0], {
//         folder: 'avatar',
//         format: 'webp',
//         quality: 85,
//         generateThumbnail: true,
//       });
//     }

//     if (files.banner) {
//       result['banner'] = await this.fileUploadService.upload(files.banner[0], {
//         folder: 'banner',
//         format: 'webp',
//         quality: 75,
//       });
//     }

//     if (files.gallery) {
//       result['gallery'] = await Promise.all(
//         files.gallery.map((file) =>
//           this.fileUploadService.upload(file, {
//             folder: 'gallery',
//             format: 'webp',
//             quality: 80,
//             generateThumbnail: true,
//           }),
//         ),
//       );
//     }

//     return { success: true, data: result };
//   }
// }
