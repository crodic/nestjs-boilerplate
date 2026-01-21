import { UserEntity } from '@/api/user/entities/user.entity';
import { ID } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity('posts')
export class PostEntity extends AbstractEntity {
  constructor(data?: Partial<PostEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('increment', {
    primaryKeyConstraintName: 'PK_post_id',
    type: 'bigint',
  })
  id!: ID;

  @Column()
  title!: string;

  @Column()
  slug!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  content?: string;

  @Column({ name: 'user_id', type: 'bigint' })
  userId!: ID;

  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_post_user_id',
  })
  @ManyToOne(() => UserEntity, (user) => user.posts)
  user: Relation<UserEntity>;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    default: null,
  })
  deletedAt: Date;
}
