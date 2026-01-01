import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';
import { applyFilters } from '@/utils/apply-filter.filter';
import { applySorts } from '@/utils/apply-sort.sort';
import { paginate } from '@/utils/offset-pagination';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import assert from 'assert';
import { plainToInstance } from 'class-transformer';
import {
  FilterOperator,
  Paginated,
  paginate as paginateLib,
  PaginateQuery,
} from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { CreatePostReqDto } from './dto/create-post.req.dto';
import { PostListReqDto } from './dto/post-list.req.dto';
import { PostResDto } from './dto/post.res.dto';
import { UpdatePostReqDto } from './dto/update-post.req.dto';
import { PostEntity } from './entities/post.entity';
import { POST_FILTERS } from './filters/post.filter';
import { POST_SORTS_V2 } from './sorts/post.sort';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postEntity: Repository<PostEntity>,
  ) {}

  async findAllWithPaginate(
    dto: PostListReqDto,
  ): Promise<OffsetPaginatedDto<PostResDto>> {
    const qb = this.postEntity
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user');

    applyFilters(qb, dto.filter, POST_FILTERS);

    applySorts(qb, dto.orderBy, POST_SORTS_V2, {
      key: 'id',
      direction: 'desc',
    });

    const [posts, metaDto] = await paginate<PostEntity>(qb, dto, {
      skipCount: false,
      takeAll: false,
    });

    return new OffsetPaginatedDto(plainToInstance(PostResDto, posts), metaDto);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<PostResDto>> {
    const result = await paginateLib(query, this.postEntity, {
      sortableColumns: ['id', 'title', 'createdAt', 'updatedAt'],
      searchableColumns: ['title', 'content'],
      defaultSortBy: [['id', 'DESC']],
      relations: ['user'],
      filterableColumns: {
        title: [FilterOperator.ILIKE],
      },
    });

    return {
      ...result,
      data: plainToInstance(PostResDto, result.data, {
        excludeExtraneousValues: true,
      }),
    } as Paginated<PostResDto>;
  }

  async findOne(id: Uuid): Promise<PostResDto> {
    assert(id, 'id is required');
    const post = await PostEntity.findOneByOrFail({ id });

    return post.toDto(PostResDto);
  }

  create(_reqDto: CreatePostReqDto) {
    throw new Error('Method not implemented.');
  }

  update(_id: Uuid, _reqDto: UpdatePostReqDto) {
    throw new Error('Method not implemented.');
  }

  delete(_id: Uuid) {
    throw new Error('Method not implemented.');
  }
}
