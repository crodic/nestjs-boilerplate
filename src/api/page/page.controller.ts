import { Uuid } from '@/common/types/common.type';
import {
  ApiAuth,
  ApiAuthWithPaginate,
  ApiPublic,
} from '@/decorators/http.decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { CreatePageReqDto } from './dto/create-page.req.dto';
import { PageResDto } from './dto/page.res.dto';
import { UpdatePageReqDto } from './dto/update-page.req.dto';
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
  @ApiPublic({
    type: PageResDto,
    summary: 'Get page detail',
  })
  findOne(@Param('id') id: Uuid): Promise<PageResDto> {
    return this.pageService.findOne(id);
  }

  @Put(':id')
  @ApiAuth({
    type: UpdatePageReqDto,
    summary: 'Update page',
  })
  @ApiParam({ name: 'id', type: 'String' })
  update(
    @Param('id') id: Uuid,
    @Body() updatePageDto: UpdatePageReqDto,
  ): Promise<PageResDto> {
    return this.pageService.update(id, updatePageDto);
  }

  @Delete(':id')
  @ApiAuth()
  remove(@Param('id') id: Uuid) {
    return this.pageService.remove(id);
  }
}
