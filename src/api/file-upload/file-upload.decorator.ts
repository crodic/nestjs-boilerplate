import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { memoryStorageConfig } from './file-upload.config';

export function UploadSingle(name = 'file') {
  return applyDecorators(
    UseInterceptors(FileInterceptor(name, memoryStorageConfig)),
  );
}

export function UploadMultiple(name = 'files', max = 10) {
  return applyDecorators(
    UseInterceptors(FilesInterceptor(name, max, memoryStorageConfig)),
  );
}

export function UploadMultipleFields(
  fields: { name: string; maxCount?: number }[],
) {
  return applyDecorators(
    UseInterceptors(FileFieldsInterceptor(fields, memoryStorageConfig)),
  );
}
