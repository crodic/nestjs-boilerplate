import { Uuid } from '@/common/types/common.type';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import { CacheKey } from '@/constants/cache.constant';
import { ErrorCode } from '@/constants/error-code.constant';
import { ValidationException } from '@/exceptions/validation.exception';
import { verifyPassword } from '@/utils/password.util';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import assert from 'assert';
import { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';
import { ClsService } from 'nestjs-cls';
import {
  FilterOperator,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { EntityManager, Repository } from 'typeorm';
import { RoleEntity } from '../role/entities/role.entity';
import { AVATAR_PATH } from './configs/multer.config';
import { AdminUserResDto } from './dto/admin-user.res.dto';
import { ChangePasswordReqDto } from './dto/change-password.req.dto';
import { ChangePasswordResDto } from './dto/change-password.res.dto';
import { CreateAdminUserReqDto } from './dto/create-admin-user.req.dto';
import { UpdateAdminUserReqDto } from './dto/update-admin-user.req.dto';
import { UpdateMeReqDto } from './dto/update-me.req.dto';
import { AdminUserEntity } from './entities/admin-user.entity';

@Injectable()
export class AdminUserService {
  private readonly logger = new Logger(AdminUserService.name);

  constructor(
    @InjectRepository(AdminUserEntity)
    private readonly adminUserRepository: Repository<AdminUserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private cls: ClsService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async hasAdmin(): Promise<boolean> {
    const cacheKey = CacheKey.SYSTEM_HAS_ADMIN;
    const cached = await this.cacheManager.get<boolean>(cacheKey);
    if (cached !== undefined) {
      return cached;
    }
    const count = await this.adminUserRepository.count();
    const hasAdmin = count > 0;

    await this.cacheManager.set(cacheKey, hasAdmin, 60_000);

    return hasAdmin;
  }

  async createWithManager(manager: EntityManager, data: CreateAdminUserReqDto) {
    const repo = manager.getRepository(AdminUserEntity);
    const adminUser = await repo.save(repo.create(data));
    this.cacheManager.del(CacheKey.SYSTEM_HAS_ADMIN);

    return adminUser;
  }

  async create(dto: CreateAdminUserReqDto): Promise<AdminUserResDto> {
    const {
      username,
      email,
      password,
      bio,
      firstName,
      lastName,
      roleId,
      birthday,
      phone,
    } = dto;

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
      firstName,
      lastName,
      email,
      password,
      bio,
      roleId,
      birthday: new Date(birthday),
      phone,
      createdBy: this.cls.get('userId') || SYSTEM_USER_ID,
      updatedBy: this.cls.get('userId') || SYSTEM_USER_ID,
    });

    const savedUser = await this.adminUserRepository.save(newUser);
    this.logger.debug(savedUser);

    return plainToInstance(AdminUserResDto, savedUser);
  }

  async findAllUser(
    query: PaginateQuery,
    email: string,
  ): Promise<Paginated<AdminUserResDto>> {
    const queryBuilder = this.adminUserRepository.createQueryBuilder('admin');

    if (email) {
      queryBuilder.andWhere('admin.email LIKE :title', {
        title: `%${email}%`,
      });
    }

    const result = await paginate(query, queryBuilder, {
      sortableColumns: ['id', 'email', 'username', 'createdAt', 'updatedAt'],
      searchableColumns: ['username', 'email', 'role.name'],
      ignoreSearchByInQueryParam: true,
      defaultSortBy: [['id', 'DESC']],
      filterableColumns: {
        'role.id': [FilterOperator.IN],
      },
      relations: ['role'],
    });

    return {
      ...result,
      data: plainToInstance(AdminUserResDto, result.data, {
        excludeExtraneousValues: true,
      }),
    } as Paginated<AdminUserResDto>;
  }

  async findOne(id: Uuid): Promise<AdminUserResDto> {
    assert(id, 'id is required');
    const user = await this.adminUserRepository.findOneByOrFail({ id });

    return user.toDto(AdminUserResDto);
  }

  async me(id: Uuid): Promise<AdminUserResDto> {
    assert(id, 'id is required');
    const user = await this.adminUserRepository.findOneBy({ id });

    if (!user) {
      throw new ForbiddenException('Forbidden');
    }

    return user.toDto(AdminUserResDto);
  }

  async updateMe(
    id: Uuid,
    dto: UpdateMeReqDto,
    file: Express.Multer.File,
  ): Promise<{ message: string }> {
    const user = await this.adminUserRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.firstName !== undefined) user.firstName = dto.firstName;
    if (dto.lastName !== undefined) user.lastName = dto.lastName;
    if (dto.bio !== undefined) user.bio = dto.bio;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.birthday !== undefined) user.birthday = new Date(dto.birthday);

    Object.assign(user, {
      ...dto,
      updatedBy: id,
      ...(file && { image: AVATAR_PATH + '/' + file.filename }),
    });

    await this.adminUserRepository.save(user);

    return {
      message: 'success',
    };
  }

  async update(id: Uuid, updateUserDto: UpdateAdminUserReqDto) {
    const user = await this.adminUserRepository.findOneByOrFail({ id });
    const updatedRole = await this.roleRepository.findOneBy({
      id: updateUserDto.roleId,
    });

    user.bio = updateUserDto.bio;
    user.email = updateUserDto.email;
    user.role = updatedRole;
    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.username = updateUserDto.username;
    user.updatedBy = SYSTEM_USER_ID;

    await this.adminUserRepository.save(user);
  }

  async remove(id: Uuid) {
    await this.adminUserRepository.findOneByOrFail({ id });
    await this.adminUserRepository.softDelete(id);
  }

  async changePassword(
    id: Uuid,
    dto: ChangePasswordReqDto,
  ): Promise<ChangePasswordResDto> {
    const user = await this.adminUserRepository.findOneByOrFail({ id });
    const isPasswordValid = await verifyPassword(dto.password, user.password);
    if (!isPasswordValid) {
      throw new ValidationException(ErrorCode.E002);
    }
    if (dto.newPassword !== dto.confirmNewPassword) {
      throw new ValidationException(ErrorCode.E003);
    }
    user.password = dto.newPassword;
    user.updatedBy = id;

    await this.adminUserRepository.save(user);

    return plainToInstance(ChangePasswordResDto, {
      message: 'Change password successfully',
      user: user.toDto(AdminUserResDto),
    });
  }
}
