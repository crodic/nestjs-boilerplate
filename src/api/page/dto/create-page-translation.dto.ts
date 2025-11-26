import { StringField } from '@/decorators/field.decorators';

export class CreatePageTranslationDto {
  @StringField()
  title: string;

  @StringField()
  content!: string;

  @StringField()
  code!: string;
}
