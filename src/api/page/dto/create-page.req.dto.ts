import { EPageStatusType } from '@/constants/entity.enum';
import {
  ClassField,
  EnumField,
  StringFieldOptional,
} from '@/decorators/field.decorators';
import { CreatePageTranslationReqDto } from './create-page-translation.req.dto';

export class CreatePageReqDto {
  @StringFieldOptional({ minLength: 0 })
  slug?: string;

  @StringFieldOptional({ minLength: 0 })
  metaKeywords?: string;

  @StringFieldOptional({ minLength: 0 })
  metaDescription?: string;

  @EnumField(() => EPageStatusType)
  status!: EPageStatusType;

  @ClassField(() => CreatePageTranslationReqDto, { each: true, isArray: true })
  translations: CreatePageTranslationReqDto[];
}
