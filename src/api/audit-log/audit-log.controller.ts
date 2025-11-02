import { CursorPaginatedDto } from '@/common/dto/cursor-pagination/paginated.dto';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';
import { ApiAuth } from '@/decorators/http.decorators';
import { CheckPolicies } from '@/decorators/policies.decorator';
import { PoliciesGuard } from '@/guards/policies.guard';
import { AppAbility } from '@/libs/casl/ability.factory';
import { AppActions, AppSubjects } from '@/utils/permissions.constant';
import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AuditLogService } from './audit-log.service';
import { AuditLogResDto } from './dto/audit-log.res.dto';
import { ListAuditLogReqDto } from './dto/list-audit-log.req.dto';
import { LoadMoreAuditLogsReqDto } from './dto/load-more-audit-logs.req.dto';

@ApiTags('Audit Logs')
@Controller({ path: 'audit-logs', version: '1' })
@UseGuards(PoliciesGuard)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}
  @Get()
  @ApiAuth({
    type: AuditLogResDto,
    summary: 'List audit logs',
    isPaginated: true,
  })
  @CheckPolicies((abilyti: AppAbility) =>
    abilyti.can(AppActions.Read, AppSubjects.Log),
  )
  findAll(
    @Query() reqDto: ListAuditLogReqDto,
  ): Promise<OffsetPaginatedDto<AuditLogResDto>> {
    return this.auditLogService.findAll(reqDto);
  }

  @Get('/load-more')
  @ApiAuth({
    type: AuditLogResDto,
    summary: 'Load more audit logs',
    isPaginated: true,
    paginationType: 'cursor',
  })
  @CheckPolicies((abilyti: AppAbility) =>
    abilyti.can(AppActions.Read, AppSubjects.Log),
  )
  async loadMoreUsers(
    @Query() reqDto: LoadMoreAuditLogsReqDto,
  ): Promise<CursorPaginatedDto<AuditLogResDto>> {
    return await this.auditLogService.loadMoreAuditLogs(reqDto);
  }

  @Get(':id')
  @ApiAuth({ type: AuditLogResDto, summary: 'Find audit log by id' })
  @ApiParam({ name: 'id', type: 'String' })
  @CheckPolicies((abilyti: AppAbility) =>
    abilyti.can(AppActions.Read, AppSubjects.Log),
  )
  async findOne(@Param('id', ParseUUIDPipe) id: Uuid): Promise<AuditLogResDto> {
    return await this.auditLogService.findOne(id);
  }
}
