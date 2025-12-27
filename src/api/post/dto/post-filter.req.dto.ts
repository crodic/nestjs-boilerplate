import { StringFieldOptional } from '@/decorators/field.decorators';

export class PostFilterReqDto {
  @StringFieldOptional({ example: 'Lorem issue dolor sit amet' })
  title?: string;
}
