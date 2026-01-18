export type ImageFormat = 'webp' | 'png' | 'jpeg';

// export interface UploadOptions {
//   folder?: string;
//   format?: ImageFormat;
//   quality?: number;
//   generateThumbnail?: boolean;
//   thumbnailWidth?: number;
//   compress?: boolean;

//   // NEW
//   maxFileSize?: number;
//   allowedFormats?: ImageFormat[];
// }

export interface UploadBaseOptions {
  folder?: string;
  maxFileSize?: number;
  allowedMimeTypes?: string[];
  rename?: boolean;
}

export interface UploadImageOptions extends UploadBaseOptions {
  quality?: number;
  format?: ImageFormat;
  compress?: boolean;
  generateThumbnail?: boolean;
  thumbnailWidth?: number;
  withName?: string;
}

export type UploadFileOptions = UploadBaseOptions;
