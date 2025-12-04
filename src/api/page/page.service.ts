import { Uuid } from '@/common/types/common.type';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import { stripHtmlTags } from '@/utils/helpers';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { ClsService } from 'nestjs-cls';
import {
  FilterOperator,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import slugify from 'slugify';
import { Repository } from 'typeorm';
import { NotificationGateway } from '../notification/notification.gateway';
import { CreatePageReqDto } from './dto/create-page.req.dto';
import { PageResDto } from './dto/page.res.dto';
import { UpdatePageReqDto } from './dto/update-page.req.dto';
import { PageTranslationEntity } from './entities/page-translation.entity';
import { PageEntity } from './entities/page.entity';

@Injectable()
export class PageService {
  private readonly logger = new Logger(PageService.name);

  constructor(
    @InjectRepository(PageEntity)
    private readonly pageRepository: Repository<PageEntity>,
    @InjectRepository(PageTranslationEntity)
    private readonly pageTranslationRepository: Repository<PageTranslationEntity>,
    private cls: ClsService,
    private socket: NotificationGateway,
  ) {}

  async create(dto: CreatePageReqDto) {
    const userId = this.cls.get('userId');

    return await this.pageRepository.manager.transaction(async (manager) => {
      const root = dto.translations?.find((trans) => trans.code === 'en');

      dto.slug = dto.slug
        ? dto.slug
        : slugify(root?.title, { locale: 'vi', lower: true, trim: true });

      dto.metaKeywords = dto.metaKeywords
        ? dto.metaKeywords
        : root.title.split(' ').join(', ');

      dto.metaDescription = dto.metaDescription
        ? dto.metaDescription
        : stripHtmlTags(root.content);

      const page = manager.create(PageEntity, {
        slug: dto.slug,
        metaKeywords: dto.metaKeywords,
        metaDescription: dto.metaDescription,
        status: dto.status,
        translations: dto.translations,
        updatedBy: userId,
        createdBy: userId,
      });

      const savedPage = await manager.save(page);

      this.socket.sendToAllExceptUser(userId, `${userId} creating new page`);

      return savedPage;
    });
  }

  async findAll(query: PaginateQuery): Promise<Paginated<PageResDto>> {
    const result = await paginate(query, this.pageRepository, {
      sortableColumns: ['id', 'createdAt'],
      searchableColumns: ['translations.code', 'translations.title'],
      defaultSortBy: [['id', 'DESC']],
      ignoreSearchByInQueryParam: true,
      filterableColumns: {
        'translations.code': [FilterOperator.IN],
      },
      relations: ['translations'],
    });

    return {
      ...result,
      data: plainToInstance(PageResDto, result.data, {
        excludeExtraneousValues: true,
      }),
    } as Paginated<PageResDto>;
  }

  async findOne(id: Uuid): Promise<PageResDto> {
    const page = await this.pageRepository.findOneOrFail({
      where: { id },
      relations: ['translations'],
    });

    return plainToInstance(PageResDto, page, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: Uuid, dto: UpdatePageReqDto) {
    return await this.pageRepository.manager.transaction(async (manager) => {
      const page = await manager.findOneOrFail(PageEntity, {
        where: { id },
        relations: ['translations'],
      });

      const root = dto.translations?.find((trans) => trans.code === 'en');

      const existingTranslations = page.translations;

      dto.slug = dto.slug
        ? dto.slug
        : slugify(root?.title, { locale: 'vi', lower: true, trim: true });

      dto.metaKeywords = dto.metaKeywords
        ? dto.metaKeywords
        : root.title.split(' ').join(', ');

      dto.metaDescription = dto.metaDescription
        ? dto.metaDescription
        : stripHtmlTags(root.content);

      Object.assign(page, {
        slug: dto.slug,
        metaKeywords: dto.metaKeywords,
        metaDescription: dto.metaDescription,
        status: dto.status,
        updatedBy: this.cls.get('userId') || SYSTEM_USER_ID,
      });

      const updatedTranslations: PageTranslationEntity[] = [];

      for (const t of dto.translations) {
        const existing = existingTranslations.find((tr) => tr.code === t.code);

        if (existing) {
          Object.assign(existing, t);
          updatedTranslations.push(existing);
        } else {
          const newTrans = manager.create(PageTranslationEntity, {
            ...t,
            page,
          });
          updatedTranslations.push(newTrans);
        }
      }

      page.translations = updatedTranslations;

      await manager.save(page);

      return plainToInstance(PageResDto, page, {
        excludeExtraneousValues: true,
      });
    });
  }

  async remove(id: Uuid) {
    await this.pageRepository.findOneByOrFail({ id });
    await this.pageRepository.softDelete(id);
  }
}
