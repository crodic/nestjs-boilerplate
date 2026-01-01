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
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import {
  FilterOperator,
  Paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { ChangePasswordReqDto } from './dto/change-password.req.dto';
import { ChangePasswordResDto } from './dto/change-password.res.dto';
import { CreateUserReqDto } from './dto/create-user.req.dto';
import { UpdateUserReqDto } from './dto/update-user.req.dto';
import { UserResDto } from './dto/user.res.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
@UseGuards(PoliciesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiAuthWithPaginate(
    { type: UserResDto, summary: 'Get all users with pagination' },
    {
      searchableColumns: ['username', 'email'],
      sortableColumns: ['id', 'email', 'username', 'created_at', 'updated_at'],
      defaultSortBy: [['id', 'DESC']],
      relations: ['posts'],
      multiWordSearch: true,
      filterableColumns: {
        createdAt: [FilterOperator.BTW],
        email: [FilterOperator.ILIKE],
        username: [FilterOperator.ILIKE],
      },
    },
  )
  @CheckPolicies((ability: AppAbility) =>
    ability.can(AppActions.Read, AppSubjects.User),
  )
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<UserResDto>> {
    return this.userService.findAllUser(query);
  }

  @ApiAuth({
    type: UserResDto,
    summary: 'Get current user',
  })
  @Get('me')
  async getCurrentUser(@CurrentUser('id') userId: Uuid): Promise<UserResDto> {
    return await this.userService.me(userId);
  }

  @Post()
  @ApiAuth({
    type: UserResDto,
    summary: 'Create user',
    statusCode: HttpStatus.CREATED,
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(AppActions.Create, AppSubjects.User),
  )
  async createUser(
    @Body() createUserDto: CreateUserReqDto,
  ): Promise<UserResDto> {
    return await this.userService.create(createUserDto);
  }

  @Get(':id')
  @ApiAuth({ type: UserResDto, summary: 'Find user by id' })
  @ApiParam({ name: 'id', type: 'String' })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(AppActions.Read, AppSubjects.User),
  )
  async findUser(@Param('id', ParseUUIDPipe) id: Uuid): Promise<UserResDto> {
    return await this.userService.findOne(id);
  }

  @Put(':id')
  @ApiAuth({ type: UserResDto, summary: 'Update user' })
  @ApiParam({ name: 'id', type: 'String' })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(AppActions.Update, AppSubjects.User),
  )
  updateUser(
    @Param('id', ParseUUIDPipe) id: Uuid,
    @Body() reqDto: UpdateUserReqDto,
  ) {
    return this.userService.update(id, reqDto);
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
    return this.userService.remove(id);
  }

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
    return this.userService.changePassword(userId, reqDto);
  }
}
