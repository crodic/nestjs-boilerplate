import { Uuid } from '@/common/types/common.type';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { ClsService } from 'nestjs-cls';
import { Repository } from 'typeorm';
import { NotificationGateway } from '../notification/notification.gateway';
import { CreatePageReqDto } from './dto/create-page.req.dto';
import { PageResDto } from './dto/page.res.dto';
import { UpdatePageDto } from './dto/update-page.dto';
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

  findAll() {
    return `This action returns all page`;
  }

  async findOne(id: Uuid): Promise<PageResDto> {
    const page = await this.pageRepository.findOneByOrFail({ id });

    return plainToInstance(PageResDto, page, {
      excludeExtraneousValues: true,
    });
  }

  update(id: number, updatePageDto: UpdatePageDto) {
    return `This action updates a #${id} page`;
  }

  remove(id: number) {
    return `This action removes a #${id} page`;
  }
}
