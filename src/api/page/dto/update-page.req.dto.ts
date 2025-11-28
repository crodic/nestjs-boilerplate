import { PartialType } from '@nestjs/swagger';
import { CreatePageReqDto } from './create-page.req.dto';

export class UpdatePageReqDto extends PartialType(CreatePageReqDto) {}
