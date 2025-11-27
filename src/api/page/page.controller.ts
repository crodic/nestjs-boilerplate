import { Uuid } from '@/common/types/common.type';
import { ApiAuth, ApiAuthWithPaginate } from '@/decorators/http.decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { CreatePageReqDto } from './dto/create-page.req.dto';
import { PageResDto } from './dto/page.res.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PageService } from './page.service';

@Controller({
  path: 'pages',
  version: '1',
})
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post()
  @ApiAuth({})
  create(@Body() dto: CreatePageReqDto) {
    return this.pageService.create(dto);
  }

  @Get()
  @ApiAuthWithPaginate(
    { type: PageResDto },
    {
      sortableColumns: ['id', 'createdAt'],
      defaultSortBy: [['id', 'DESC']],
      relations: ['translations'],
    },
  )
  findAll(@Paginate() query: PaginateQuery) {
    return this.pageService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: Uuid): Promise<PageResDto> {
    return this.pageService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
    return this.pageService.update(+id, updatePageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pageService.remove(+id);
  }
}
