import { ID } from '@/common/types/common.type';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { assert } from 'console';
import {
  FilterOperator,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { AuditLogResDto } from './dto/audit-log.res.dto';
import { AuditLogEntity } from './entities/audit-log.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLogEntity)
    private readonly auditLogRepository: Repository<AuditLogEntity>,
  ) {}

  async findAll(query: PaginateQuery): Promise<Paginated<AuditLogResDto>> {
    const result = await paginate(query, this.auditLogRepository, {
      sortableColumns: ['id', 'createdAt'],
      defaultSortBy: [['createdAt', 'DESC']],
      filterableColumns: {
        createdAt: [FilterOperator.GTE, FilterOperator.LTE],
        action: [FilterOperator.IN],
        entity: [FilterOperator.ILIKE],
        entityId: [FilterOperator.ILIKE],
        userId: [FilterOperator.EQ],
      },
    });

    return {
      ...result,
      data: plainToInstance(AuditLogResDto, result.data, {
        excludeExtraneousValues: true,
      }),
    } as Paginated<AuditLogResDto>;
  }

  async findOne(id: ID): Promise<AuditLogResDto> {
    assert(id, 'id is required');
    const log = await this.auditLogRepository.findOneByOrFail({ id });

    return plainToInstance(AuditLogResDto, log);
  }
}
