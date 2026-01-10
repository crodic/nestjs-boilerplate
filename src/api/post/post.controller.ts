import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';
import {
  ApiAuth,
  ApiAuthWithPaginate,
  SimpleApiPublic,
} from '@/decorators/http.decorators';
import { AuthGuard } from '@/guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  FilterOperator,
  Paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { ParseQueryPipe } from 'src/pipes/parse-query.pipe';
import { CreatePostReqDto } from './dto/create-post.req.dto';
import { PostListReqDto } from './dto/post-list.req.dto';
import { PostResDto } from './dto/post.res.dto';
import { UpdatePostReqDto } from './dto/update-post.req.dto';
import { PostService } from './post.service';

@ApiTags('Posts')
@Controller({
  path: 'posts',
  version: '1',
})
@UseGuards(AuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/paginated')
  @SimpleApiPublic({
    type: PostResDto,
    summary: 'Get paginated posts',
    isPaginated: true,
  })
  @ApiQuery({
    name: 'filter[title]',
    required: false,
    type: String,
    example: 'Lorem ipsum dolor sit amet',
  })
  findAllPaginated(
    @Query(new ParseQueryPipe()) dto: PostListReqDto,
  ): Promise<OffsetPaginatedDto<PostResDto>> {
    return this.postService.findAllWithPaginate(dto);
  }

  @Get('/')
  @ApiAuthWithPaginate(
    { type: PostResDto },
    {
      sortableColumns: ['id', 'title', 'updatedAt', 'createdAt'],
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['title', 'content'],
      relations: ['user'],
      filterableColumns: {
        title: [FilterOperator.ILIKE],
      },
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

  @Put(':id')
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
