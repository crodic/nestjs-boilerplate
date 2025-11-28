import { ClassField } from '@/decorators/field.decorators';
import { OmitType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { CreatePageReqDto } from './create-page.req.dto';
import { UpdatePageTranslationReqDto } from './update-page-translation.req.dto';

export class UpdatePageReqDto extends PartialType(
  OmitType(CreatePageReqDto, ['translations'] as const),
) {
  @ClassField(() => UpdatePageTranslationReqDto, { each: true, isArray: true })
  translations?: UpdatePageTranslationReqDto[];
}
