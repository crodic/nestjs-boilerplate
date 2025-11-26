import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageTranslationEntity } from './entities/page-translation.entity';
import { PageEntity } from './entities/page.entity';
import { PageController } from './page.controller';
import { PageService } from './page.service';

@Module({
  imports: [TypeOrmModule.forFeature([PageEntity, PageTranslationEntity])],
  controllers: [PageController],
  providers: [PageService],
})
export class PageModule {}
