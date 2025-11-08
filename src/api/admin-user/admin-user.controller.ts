import { Uuid } from '@/common/types/common.type';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { ApiAuth, ApiAuthWithPaginate } from '@/decorators/http.decorators';
import { CheckPolicies } from '@/decorators/policies.decorator';
import { PoliciesGuard } from '@/guards/policies.guard';
import { AppAbility } from '@/libs/casl/ability.factory';
import { AppActions, AppSubjects } from '@/utils/permissions.constant';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { AdminUserService } from './admin-user.service';
import { AdminUserResDto } from './dto/admin-user.res.dto';
import { ChangePasswordReqDto } from './dto/change-password.req.dto';
import { ChangePasswordResDto } from './dto/change-password.res.dto';
import { CreateAdminUserReqDto } from './dto/create-admin-user.req.dto';
import { UpdateAdminUserReqDto } from './dto/update-admin-user.req.dto';

@ApiTags('Admin User')
@Controller({
  path: 'admin-users',
  version: '1',
})
@UseGuards(PoliciesGuard)
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Get()
  @ApiAuthWithPaginate(
    {
      dto: AdminUserResDto,
      summary: 'Get all users',
      description: 'Return all users',
    },
    {
      sortableColumns: ['id', 'email', 'username', 'created_at', 'updated_at'],
      defaultSortBy: [['id', 'DESC']],
      relations: ['role'],
    },
  )
  @ApiQuery({ name: 'email', required: false })
  findAll(
    @Paginate() query: PaginateQuery,
    @Query('email') email: string,
  ): Promise<Paginated<AdminUserResDto>> {
    return this.adminUserService.findAllUser(query, email);
  }

  // --------------------------------------------------

  @Get('me')
  @ApiAuth({
    type: AdminUserResDto,
    summary: 'Get current user',
  })
  async getCurrentUser(
    @CurrentUser('id') userId: Uuid,
  ): Promise<AdminUserResDto> {
    return await this.adminUserService.findOne(userId);
  }

  // --------------------------------------------------

  @Post()
  @ApiAuth({
    type: AdminUserResDto,
    summary: 'Create user',
    statusCode: HttpStatus.CREATED,
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(AppActions.Create, AppSubjects.User),
  )
  async createUser(
    @Body() createAdminUserDto: CreateAdminUserReqDto,
  ): Promise<AdminUserResDto> {
    return await this.adminUserService.create(createAdminUserDto);
  }

  // --------------------------------------------------

  @Get(':id')
  @ApiAuth({ type: AdminUserResDto, summary: 'Find user by id' })
  @ApiParam({ name: 'id', type: 'String' })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(AppActions.Read, AppSubjects.User),
  )
  async findUser(
    @Param('id', ParseUUIDPipe) id: Uuid,
  ): Promise<AdminUserResDto> {
    return await this.adminUserService.findOne(id);
  }

  // --------------------------------------------------

  @Patch(':id')
  @ApiAuth({ type: AdminUserResDto, summary: 'Update user' })
  @ApiParam({ name: 'id', type: 'String' })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(AppActions.Update, AppSubjects.User),
  )
  updateUser(
    @Param('id', ParseUUIDPipe) id: Uuid,
    @Body() reqDto: UpdateAdminUserReqDto,
  ) {
    return this.adminUserService.update(id, reqDto);
  }

  // --------------------------------------------------

  @Delete(':id')
  @ApiAuth({
    summary: 'Delete user',
    errorResponses: [400, 401, 403, 404, 500],
  })
  @ApiParam({ name: 'id', type: 'String' })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(AppActions.Delete, AppSubjects.User),
  )
  removeUser(@Param('id', ParseUUIDPipe) id: Uuid) {
    return this.adminUserService.remove(id);
  }

  // --------------------------------------------------

  @ApiAuth({
    type: ChangePasswordResDto,
    summary: 'Change password',
    errorResponses: [400, 401, 403, 404, 500],
  })
  @Post('me/change-password')
  async changePassword(
    @CurrentUser('id') userId: Uuid,
    @Body() reqDto: ChangePasswordReqDto,
  ): Promise<ChangePasswordResDto> {
    return this.adminUserService.changePassword(userId, reqDto);
  }
}
