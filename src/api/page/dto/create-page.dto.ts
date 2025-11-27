import { EPageStatusType } from '@/constants/entity.enum';
import {
  ClassField,
  EnumField,
  StringFieldOptional,
} from '@/decorators/field.decorators';
import { CreatePageTranslationDto } from './create-page-translation.dto';

export class CreatePageDto {
  @StringFieldOptional({ minLength: 0 })
  slug?: string;

  @StringFieldOptional({ minLength: 0 })
  metaKeywords?: string;

  @StringFieldOptional({ minLength: 0 })
  metaDescription?: string;

  @EnumField(() => EPageStatusType)
  status!: EPageStatusType;

  @ClassField(() => CreatePageTranslationDto, { each: true, isArray: true })
  translations: CreatePageTranslationDto[];
}
