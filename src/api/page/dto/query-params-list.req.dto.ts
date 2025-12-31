import { StringFieldOptional } from '@/decorators/field.decorators';

export class QueryParamsListReqDto {
  @StringFieldOptional()
  title_en: string;

  @StringFieldOptional()
  title_vi: string;
}
