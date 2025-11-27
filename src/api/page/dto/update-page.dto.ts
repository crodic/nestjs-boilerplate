import { PartialType } from '@nestjs/swagger';
import { CreatePageReqDto } from './create-page.req.dto';

export class UpdatePageDto extends PartialType(CreatePageReqDto) {}
