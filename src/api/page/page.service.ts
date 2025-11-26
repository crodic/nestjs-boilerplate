import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { Repository } from 'typeorm';
import { CreatePageDto } from './dto/create-page.dto';
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
  ) {}
  async create(dto: CreatePageDto) {
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

      return savedPage;
    });
  }

  findAll() {
    return `This action returns all page`;
  }

  findOne(id: number) {
    return `This action returns a #${id} page`;
  }

  update(id: number, updatePageDto: UpdatePageDto) {
    return `This action updates a #${id} page`;
  }

  remove(id: number) {
    return `This action removes a #${id} page`;
  }
}
