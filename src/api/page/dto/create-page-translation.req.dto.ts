import { StringField } from '@/decorators/field.decorators';

export class CreatePageTranslationReqDto {
  @StringField()
  title: string;

  @StringField()
  content!: string;

  @StringField()
  code!: string;
}
