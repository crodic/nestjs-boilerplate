import { CursorPaginationDto } from '@/common/dto/cursor-pagination/cursor-pagination.dto';
import { CursorPaginatedDto } from '@/common/dto/cursor-pagination/paginated.dto';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import { CacheKey } from '@/constants/cache.constant';
import { buildPaginator } from '@/utils/cursor-pagination';
import { paginate } from '@/utils/offset-pagination';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { assert } from 'console';
import { EntityManager, Repository } from 'typeorm';
import { CreateRoleReqDto } from './dto/create-role.req.dto';
import { ListRoleReqDto } from './dto/list-role.req.dto';
import { LoadMoreRoleReqDto } from './dto/load-more-roles.req.dto';
import { RoleResDto } from './dto/role.res.dto';
import { UpdateRoleReqDto } from './dto/update-role.req.dto';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async hasRole(): Promise<boolean> {
    const cacheKey = CacheKey.SYSTEM_HAS_ROLE;
    const cached = await this.cacheManager.get<boolean>(cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    const count = await this.roleRepository.count();
    const hasRole = count > 0;

    await this.cacheManager.set(cacheKey, hasRole, 60_000);

    return hasRole;
  }

  async createWithManager(
    manager: EntityManager,
    data: CreateRoleReqDto,
  ): Promise<RoleEntity> {
    const repo = manager.getRepository(RoleEntity);
    const role = await repo.save(repo.create(data));
    this.cacheManager.del(CacheKey.SYSTEM_HAS_ROLE);

    return role;
  }

  async create(dto: CreateRoleReqDto): Promise<RoleResDto> {
    const newRole = new RoleEntity({
      ...dto,
      createdBy: SYSTEM_USER_ID,
      updatedBy: SYSTEM_USER_ID,
    });

    const savedRole = await this.roleRepository.save(newRole);

    this.logger.debug(savedRole);

    return plainToInstance(RoleResDto, savedRole);
  }

  async findAll(
    reqDto: ListRoleReqDto,
  ): Promise<OffsetPaginatedDto<RoleResDto>> {
    const query = this.roleRepository
      .createQueryBuilder('role')
      .orderBy('role.createdAt', 'DESC');
    const [roles, metaDto] = await paginate<RoleEntity>(query, reqDto, {
      skipCount: false,
      takeAll: false,
    });
    return new OffsetPaginatedDto(plainToInstance(RoleResDto, roles), metaDto);
  }

  async loadMoreUsers(
    reqDto: LoadMoreRoleReqDto,
  ): Promise<CursorPaginatedDto<RoleResDto>> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');
    const paginator = buildPaginator({
      entity: RoleEntity,
      alias: 'role',
      paginationKeys: ['createdAt'],
      query: {
        limit: reqDto.limit,
        order: 'DESC',
        afterCursor: reqDto.afterCursor,
        beforeCursor: reqDto.beforeCursor,
      },
    });

    const { data, cursor } = await paginator.paginate(queryBuilder);

    const metaDto = new CursorPaginationDto(
      data.length,
      cursor.afterCursor,
      cursor.beforeCursor,
      reqDto,
    );

    return new CursorPaginatedDto(plainToInstance(RoleResDto, data), metaDto);
  }

  async findOne(id: Uuid): Promise<RoleResDto> {
    assert(id, 'id is required');
    const role = await this.roleRepository.findOneByOrFail({ id });
    return role.toDto(RoleResDto);
  }

  async update(id: Uuid, updateRoleDto: UpdateRoleReqDto) {
    const role = await this.roleRepository.findOneByOrFail({ id });

    role.name = updateRoleDto.name;
    role.description = updateRoleDto.description;
    role.permissions = updateRoleDto.permissions;
    role.updatedBy = SYSTEM_USER_ID;

    await this.roleRepository.save(role);
  }

  async remove(id: Uuid) {
    await this.roleRepository.findOneByOrFail({ id });
    await this.roleRepository.softDelete(id);
  }
}
