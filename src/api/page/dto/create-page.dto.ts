import { EPageStatusType } from '@/constants/entity.enum';
import { EnumField, StringFieldOptional } from '@/decorators/field.decorators';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
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

  @ValidateNested()
  @Type(() => CreatePageTranslationDto)
  @IsNotEmpty()
  translations: CreatePageTranslationDto[];
}
