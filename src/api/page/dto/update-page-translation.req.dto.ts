import { PartialType } from '@nestjs/swagger';
import { CreatePageTranslationReqDto } from './create-page-translation.req.dto';

export class UpdatePageTranslationReqDto extends PartialType(
  CreatePageTranslationReqDto,
) {}
