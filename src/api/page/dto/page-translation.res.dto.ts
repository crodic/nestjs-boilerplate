import { Uuid } from '@/common/types/common.type';
import { StringField, UUIDField } from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PageTranslationResDto {
  @UUIDField()
  @Expose()
  id!: Uuid;

  @StringField()
  @Expose()
  title: string;

  @StringField()
  @Expose()
  content: string;

  @StringField()
  @Expose()
  code: string;

  @UUIDField()
  pageId: Uuid;
}
