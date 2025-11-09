import { Uuid } from '@/common/types/common.type';
import { ApiAuth, ApiAuthWithPaginate } from '@/decorators/http.decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { CreatePostReqDto } from './dto/create-post.req.dto';
import { PostResDto } from './dto/post.res.dto';
import { UpdatePostReqDto } from './dto/update-post.req.dto';
import { PostService } from './post.service';

@ApiTags('Posts')
@Controller({
  path: 'posts',
  version: '1',
})
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/')
  @ApiAuthWithPaginate(
    { type: PostResDto },
    {
      sortableColumns: ['id', 'title', 'content'],
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['title', 'content'],
      relations: ['user'],
    },
  )
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<PostResDto>> {
    return this.postService.findAll(query);
  }

  @Get(':id')
  @ApiAuth({
    type: PostResDto,
    summary: 'Get post by id',
  })
  @ApiParam({ name: 'id', type: 'String' })
  async findOne(@Param('id', ParseUUIDPipe) id: Uuid) {
    return this.postService.findOne(id);
  }

  @Post()
  @ApiAuth({
    type: PostResDto,
    summary: 'Create post',
  })
  async create(@Body() reqDto: CreatePostReqDto) {
    return this.postService.create(reqDto);
  }

  @Patch(':id')
  @ApiAuth({
    type: PostResDto,
    summary: 'Update post by id',
  })
  @ApiParam({ name: 'id', type: 'String' })
  async update(
    @Param('id', ParseUUIDPipe) id: Uuid,
    @Body() reqDto: UpdatePostReqDto,
  ) {
    return this.postService.update(id, reqDto);
  }

  @Delete(':id')
  @ApiAuth({
    summary: 'Delete post',
  })
  @ApiParam({ name: 'id', type: 'String' })
  async delete(@Param('id', ParseUUIDPipe) id: Uuid) {
    return this.postService.delete(id);
  }
}
