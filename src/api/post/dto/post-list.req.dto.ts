import { PageOptionsDto } from '@/common/dto/offset-pagination/page-options.dto';
import { DeepObjectField } from '@/decorators/field.decorators';
import { PostFilterReqDto } from './post-filter.req.dto';

export class PostListReqDto extends PageOptionsDto {
  @DeepObjectField(PostFilterReqDto)
  filter?: PostFilterReqDto;
}
