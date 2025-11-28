import { Uuid } from '@/common/types/common.type';
import { WrapperType } from '@/common/types/types';
import {
  ClassField,
  StringField,
  StringFieldOptional,
  UUIDField,
} from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';
import { PageTranslationResDto } from './page-translation.res.dto';

@Exclude()
export class PageResDto {
  @UUIDField()
  @Expose()
  id!: Uuid;

  @StringField()
  @Expose()
  slug!: string;

  @StringFieldOptional()
  @Expose()
  metaKeywords?: string;

  @StringFieldOptional()
  @Expose()
  metaDescription?: string;

  @StringField()
  status!: string;

  @ClassField(() => PageTranslationResDto, { isArray: true, each: true })
  @Expose()
  translations: WrapperType<PageTranslationResDto[]>;

  @StringField()
  @Expose()
  createdAt: Date;

  @StringField()
  @Expose()
  updatedAt: Date;
}
