import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { memoryStorage } from 'multer';

export const imageMimes = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
];

// const IMAGE_ACCEPTED_FORMATS =
//   process.env.ALLOWED_IMAGES?.split(',') || imageMimes;

export const memoryStorageConfig: MulterOptions = {
  storage: memoryStorage(),
  // fileFilter: (req, file, cb) => {
  //   if (!IMAGE_ACCEPTED_FORMATS.includes(file.mimetype)) {
  //     return cb(new Error('Invalid file type.'), false);
  //   }
  //   cb(null, true);
  // },
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB
  },
};

export const FILE_EXTENSIONS = {
  images: [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'image/tiff',
    'image/bmp',
    'image/avif',
    'image/webp',
    'image/ico',
  ],
  files: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip',
    'application/x-rar-compressed',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.presentation',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-word.document.macroEnabled.12',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel.addin.macroEnabled.12',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ],
};
