import { CursorPaginatedDto } from '@/common/dto/cursor-pagination/paginated.dto';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { ApiAuth } from '@/decorators/http.decorators';
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
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AdminUserService } from './admin-user.service';
import { AdminUserResDto } from './dto/admin-user.res.dto';
import { CreateAdminUserReqDto } from './dto/create-admin-user.req.dto';
import { ListAdminUserReqDto } from './dto/list-admin-user.req.dto';
import { LoadMoreAdminUsersReqDto } from './dto/load-more-admin-users.req.dto';
import { UpdateAdminUserReqDto } from './dto/update-admin-user.req.dto';

@ApiTags('Admin User')
@Controller({
  path: 'admin-users',
  version: '1',
})
@UseGuards(PoliciesGuard)
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @ApiAuth({
    type: AdminUserResDto,
    summary: 'Get current user',
  })
  @Get('me')
  async getCurrentUser(
    @CurrentUser('id') userId: Uuid,
  ): Promise<AdminUserResDto> {
    return await this.adminUserService.findOne(userId);
  }

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

  @Get()
  @ApiAuth({
    type: AdminUserResDto,
    summary: 'List users',
    isPaginated: true,
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(AppActions.Read, AppSubjects.User),
  )
  async findAllUsers(
    @Query() reqDto: ListAdminUserReqDto,
  ): Promise<OffsetPaginatedDto<AdminUserResDto>> {
    return await this.adminUserService.findAll(reqDto);
  }

  @Get('/load-more')
  @ApiAuth({
    type: AdminUserResDto,
    summary: 'Load more users',
    isPaginated: true,
    paginationType: 'cursor',
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(AppActions.Read, AppSubjects.User),
  )
  async loadMoreUsers(
    @Query() reqDto: LoadMoreAdminUsersReqDto,
  ): Promise<CursorPaginatedDto<AdminUserResDto>> {
    return await this.adminUserService.loadMoreUsers(reqDto);
  }

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

  @ApiAuth()
  @Post('me/change-password')
  async changePassword() {
    return 'change-password';
  }
}
