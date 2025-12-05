import { Uuid } from '@/common/types/common.type';
import {
  ApiAuth,
  ApiAuthWithPaginate,
  ApiPublic,
} from '@/decorators/http.decorators';
import { CheckPolicies } from '@/decorators/policies.decorator';
import { PoliciesGuard } from '@/guards/policies.guard';
import { AppAbility } from '@/libs/casl/ability.factory';
import { AppActions, AppSubjects } from '@/utils/permissions.constant';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { CreatePageReqDto } from './dto/create-page.req.dto';
import { PageResDto } from './dto/page.res.dto';
import { UpdatePageReqDto } from './dto/update-page.req.dto';
import { PageService } from './page.service';

@ApiTags('Pages')
@Controller({
  path: 'pages',
  version: '1',
})
@UseGuards(PoliciesGuard)
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post()
  @ApiAuth({
    type: PageResDto,
    summary: 'Create new page',
    statusCode: 201,
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(AppActions.Create, AppSubjects.Page),
  )
  create(@Body() dto: CreatePageReqDto): Promise<PageResDto> {
    return this.pageService.create(dto);
  }

  @Get()
  @ApiAuthWithPaginate(
    { type: PageResDto, summary: 'Get page listing' },
    {
      sortableColumns: ['id', 'createdAt'],
      defaultSortBy: [['id', 'DESC']],
      relations: ['translations'],
    },
  )
  @CheckPolicies((ability: AppAbility) =>
    ability.can(AppActions.Read, AppSubjects.Page),
  )
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<PageResDto>> {
    return this.pageService.findAll(query);
  }

  @Get(':id')
  @ApiPublic({
    type: PageResDto,
    summary: 'Get page detail',
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(AppActions.Read, AppSubjects.Page),
  )
  findOne(@Param('id') id: Uuid): Promise<PageResDto> {
    return this.pageService.findOne(id);
  }

  @Put(':id')
  @ApiAuth({
    type: PageResDto,
    summary: 'Update page',
  })
  @ApiParam({ name: 'id', type: 'String' })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(AppActions.Update, AppSubjects.Page),
  )
  update(
    @Param('id') id: Uuid,
    @Body() updatePageDto: UpdatePageReqDto,
  ): Promise<PageResDto> {
    return this.pageService.update(id, updatePageDto);
  }

  @Delete(':id')
  @ApiAuth({
    summary: 'Delete page',
    errorResponses: [400, 401, 403, 404, 500],
  })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(AppActions.Delete, AppSubjects.Page),
  )
  remove(@Param('id') id: Uuid) {
    return this.pageService.remove(id);
  }
}
