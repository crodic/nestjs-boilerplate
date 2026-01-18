import { AllConfigType } from '@/config/config.type';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';
import {
  ImageFormat,
  UploadFileOptions,
  UploadImageOptions,
} from './file-upload.types';

@Injectable()
export class FileUploadService {
  private readonly root: string;

  constructor(private readonly config: ConfigService<AllConfigType>) {
    this.root = this.config.get<AllConfigType>('app.uploadFolder', {
      infer: true,
    });

    if (!existsSync(this.root)) {
      mkdirSync(this.root, { recursive: true });
    }
  }

  private prepareFolder(folder: string): string {
    const target = join(this.root, folder);
    if (!existsSync(target)) mkdirSync(target, { recursive: true });
    return target;
  }

  private extractExt(mime: string): ImageFormat {
    if (mime.includes('png')) return 'png';
    if (mime.includes('jpeg') || mime.includes('jpg')) return 'jpeg';
    return 'webp';
  }

  private applyFormat(img: sharp.Sharp, format: ImageFormat, quality: number) {
    switch (format) {
      case 'webp':
        return img.webp({ quality });
      case 'jpeg':
        return img.jpeg({ quality });
      case 'png':
        return img.png({ compressionLevel: quality >= 90 ? 1 : 9 });
      default:
        return img;
    }
  }

  async upload(file: Express.Multer.File, options: UploadImageOptions = {}) {
    const {
      folder = 'default',
      format,
      quality = 80,
      generateThumbnail = false,
      thumbnailWidth = 300,
      compress = true,
      withName,
      maxFileSize = 5 * 1024 * 1024,
      allowedMimeTypes = ['jpeg', 'png', 'webp'],
    } = options;

    // 1. Validate file size
    if (file.size > maxFileSize) {
      throw new Error(
        `File size exceeds maximum limit of ${maxFileSize} bytes`,
      );
    }

    // 2. Validate file format
    const detectedExt = this.extractExt(file.mimetype);
    if (!allowedMimeTypes.includes(detectedExt)) {
      throw new Error(
        `File format not allowed. Allowed formats are: ${allowedMimeTypes.join(', ')}`,
      );
    }

    const targetPath = this.prepareFolder(folder);

    const baseName = withName ?? file.originalname.replace(/\.[^.]+$/, '');
    const ext = format ?? detectedExt;
    const filename = `${Date.now()}-${baseName}.${ext}`;
    const fullPath = join(targetPath, filename);

    let img = sharp(file.buffer);

    // Quality + compress
    if (format) {
      img = this.applyFormat(img, format, quality);
    } else if (compress) {
      img = img.webp({ quality });
    }

    await img.toFile(fullPath);

    let thumb = null;
    if (generateThumbnail) {
      thumb = await this.createThumbnail(
        file,
        `${folder}/thumbs`,
        filename,
        thumbnailWidth,
      );
    }

    return {
      path: `${folder}/${filename}`,
      thumbnail: thumb,
    };
  }

  async createThumbnail(
    file: Express.Multer.File,
    folder: string,
    filename: string,
    width = 300,
  ) {
    const target = this.prepareFolder(folder);
    const thumbPath = join(target, filename);

    await sharp(file.buffer).resize(width).toFile(thumbPath);

    return `${folder}/${filename}`;
  }

  async uploadFile(file: Express.Multer.File, options: UploadFileOptions = {}) {
    const {
      folder = 'files',
      rename = true,
      maxFileSize = 15 * 1024 * 1024,
      allowedMimeTypes = [],
    } = options;

    // Validate size
    if (file.size > maxFileSize) {
      throw new Error(
        `File size exceeds maximum limit of ${maxFileSize} bytes`,
      );
    }

    // Validate mime
    if (
      allowedMimeTypes.length > 0 &&
      !allowedMimeTypes.includes(file.mimetype)
    ) {
      throw new Error(
        `Invalid file type. Allowed: ${allowedMimeTypes.join(', ')}`,
      );
    }

    const target = this.prepareFolder(folder);

    const ext = file.originalname.split('.').pop();
    const base = file.originalname.replace(/\.[^.]+$/, '');

    const filename = rename
      ? `${Date.now()}-${base}.${ext}`
      : file.originalname;

    const fullPath = join(target, filename);

    writeFileSync(fullPath, file.buffer);

    return {
      path: `${folder}/${filename}`,
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  async uploadFiles(
    files: Express.Multer.File[],
    options: UploadFileOptions = {},
  ) {
    if (!files || files.length === 0) {
      throw new Error('No files provided');
    }

    return Promise.all(files.map((f) => this.uploadFile(f, options)));
  }

  delete(path: string) {
    const fullPath = join(this.root, path);
    if (!existsSync(fullPath)) return false;

    unlinkSync(fullPath);
    return true;
  }
}
