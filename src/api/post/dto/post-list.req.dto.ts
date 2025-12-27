import { PageOptionsDto } from '@/common/dto/offset-pagination/page-options.dto';
import { StringFieldOptional } from '@/decorators/field.decorators';

export class PostListReqDto extends PageOptionsDto {
  @StringFieldOptional({ example: 'Lorem issue dolor sit amet' })
  title?: string;
}
