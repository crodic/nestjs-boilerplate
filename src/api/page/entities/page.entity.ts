import { Uuid } from '@/common/types/common.type';
import { EPageStatusType } from '@/constants/entity.enum';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { PageTranslationEntity } from './page-translation.entity';

@Entity('pages')
export class PageEntity extends AbstractEntity {
  constructor(data?: Partial<PageEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_page_id',
  })
  id!: Uuid;

  @Column({
    name: 'slug',
  })
  @Index('UQ_page_slug', { where: '"deleted_at" IS NULL', unique: true })
  slug!: string;

  @Column({
    name: 'meta_keywords',
    length: 160,
    nullable: true,
  })
  metaKeywords?: string;

  @Column({
    name: 'meta_description',
    length: 240,
    nullable: true,
  })
  metaDescription?: string;

  @Column({
    type: 'enum',
    enum: EPageStatusType,
    enumName: 'page_status_enum',
    nullable: false,
    name: 'status',
  })
  status!: EPageStatusType;

  @OneToMany(() => PageTranslationEntity, (translation) => translation.page, {
    cascade: true,
  })
  translations: Relation<PageTranslationEntity[]>;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    default: null,
  })
  deletedAt: Date;
}
