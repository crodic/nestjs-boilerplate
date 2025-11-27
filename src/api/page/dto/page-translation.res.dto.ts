import { StringField } from '@/decorators/field.decorators';
import { Expose } from 'class-transformer';

export class PageTranslationResDto {
  @StringField()
  @Expose()
  title: string;

  @StringField()
  @Expose()
  content: string;

  @StringField()
  @Expose()
  code: string;
}
