import { Uuid } from '@/common/types/common.type';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { PageEntity } from './page.entity';

@Entity('page-translations')
export class PageTranslationEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_page_translation_id',
  })
  id!: Uuid;

  @Column({
    name: 'code',
    length: 10,
  })
  code!: string;

  @Column({
    name: 'title',
  })
  title!: string;

  @Column({
    name: 'content',
    type: 'text',
  })
  content!: string;

  @JoinColumn({
    name: 'page_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_page_page_translation_id',
  })
  @ManyToOne(() => PageEntity, (page) => page.translations, {
    onDelete: 'CASCADE',
  })
  page: Relation<PageEntity>;

  @Column({ name: 'page_id' })
  pageId: Uuid;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  updatedAt: Date;
}
