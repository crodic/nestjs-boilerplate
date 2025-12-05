import { CaslAbilityFactory } from '@/libs/casl/ability.factory';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '../notification/notification.module';
import { PageTranslationEntity } from './entities/page-translation.entity';
import { PageEntity } from './entities/page.entity';
import { PageController } from './page.controller';
import { PageService } from './page.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PageEntity, PageTranslationEntity]),
    NotificationModule,
  ],
  controllers: [PageController],
  providers: [PageService, CaslAbilityFactory],
})
export class PageModule {}
