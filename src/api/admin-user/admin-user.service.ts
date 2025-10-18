import { CursorPaginationDto } from '@/common/dto/cursor-pagination/cursor-pagination.dto';
import { CursorPaginatedDto } from '@/common/dto/cursor-pagination/paginated.dto';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import { ErrorCode } from '@/constants/error-code.constant';
import { ValidationException } from '@/exceptions/validation.exception';
import { buildPaginator } from '@/utils/cursor-pagination';
import { paginate } from '@/utils/offset-pagination';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import assert from 'assert';
import { plainToInstance } from 'class-transformer';
import { ClsService } from 'nestjs-cls';
import { Repository } from 'typeorm';
import { AdminUserResDto } from './dto/admin-user.res.dto';
import { CreateAdminUserReqDto } from './dto/create-admin-user.req.dto';
import { ListAdminUserReqDto } from './dto/list-admin-user.req.dto';
import { LoadMoreAdminUsersReqDto } from './dto/load-more-admin-users.req.dto';
import { UpdateAdminUserReqDto } from './dto/update-admin-user.req.dto';
import { AdminUserEntity } from './entities/admin-user.entity';

@Injectable()
export class AdminUserService {
  private readonly logger = new Logger(AdminUserService.name);

  constructor(
    @InjectRepository(AdminUserEntity)
    private readonly adminUserRepository: Repository<AdminUserEntity>,
    private cls: ClsService,
  ) {}

  async create(dto: CreateAdminUserReqDto): Promise<AdminUserResDto> {
    const { username, email, password, bio, image } = dto;

    // check uniqueness of username/email
    const user = await this.adminUserRepository.findOne({
      where: [
        {
          username,
        },
        {
          email,
        },
      ],
    });

    if (user) {
      throw new ValidationException(ErrorCode.E001);
    }

    const newUser = new AdminUserEntity({
      username,
      email,
      password,
      bio,
      image,
      createdBy: this.cls.get('userId') || SYSTEM_USER_ID,
      updatedBy: this.cls.get('userId') || SYSTEM_USER_ID,
    });

    const savedUser = await this.adminUserRepository.save(newUser);
    this.logger.debug(savedUser);

    return plainToInstance(AdminUserResDto, savedUser);
  }

  async findAll(
    reqDto: ListAdminUserReqDto,
  ): Promise<OffsetPaginatedDto<AdminUserResDto>> {
    const query = this.adminUserRepository
      .createQueryBuilder('user')
      .orderBy('user.createdAt', 'DESC');
    const [users, metaDto] = await paginate<AdminUserEntity>(query, reqDto, {
      skipCount: false,
      takeAll: false,
    });
    return new OffsetPaginatedDto(
      plainToInstance(AdminUserResDto, users),
      metaDto,
    );
  }

  async loadMoreUsers(
    reqDto: LoadMoreAdminUsersReqDto,
  ): Promise<CursorPaginatedDto<AdminUserResDto>> {
    const queryBuilder =
      this.adminUserRepository.createQueryBuilder('admin_user');
    const paginator = buildPaginator({
      entity: AdminUserEntity,
      alias: 'admin_user',
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

    return new CursorPaginatedDto(
      plainToInstance(AdminUserResDto, data),
      metaDto,
    );
  }

  async findOne(id: Uuid): Promise<AdminUserResDto> {
    assert(id, 'id is required');
    const user = await this.adminUserRepository.findOneByOrFail({ id });

    return user.toDto(AdminUserResDto);
  }

  async update(id: Uuid, updateUserDto: UpdateAdminUserReqDto) {
    const user = await this.adminUserRepository.findOneByOrFail({ id });

    user.bio = updateUserDto.bio;
    user.image = updateUserDto.image;
    user.updatedBy = SYSTEM_USER_ID;

    await this.adminUserRepository.save(user);
  }

  async remove(id: Uuid) {
    await this.adminUserRepository.findOneByOrFail({ id });
    await this.adminUserRepository.softDelete(id);
  }
}
