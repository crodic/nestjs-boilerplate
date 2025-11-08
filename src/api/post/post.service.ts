import { Uuid } from '@/common/types/common.type';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import assert from 'assert';
import { plainToInstance } from 'class-transformer';
import {
  Paginated,
  paginate as paginateLib,
  PaginateQuery,
} from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { CreatePostReqDto } from './dto/create-post.req.dto';
import { PostResDto } from './dto/post.res.dto';
import { UpdatePostReqDto } from './dto/update-post.req.dto';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postEntity: Repository<PostEntity>,
  ) {}

  async findAll(query: PaginateQuery): Promise<Paginated<PostResDto>> {
    const result = await paginateLib(query, this.postEntity, {
      sortableColumns: ['id', 'title', 'content'],
      searchableColumns: ['title', 'content'],
      defaultSortBy: [['id', 'DESC']],
      relations: ['user'],
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
