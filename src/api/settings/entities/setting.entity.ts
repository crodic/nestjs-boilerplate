import { ID } from '@/common/types/common.type';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('settings')
export class SettingEntity {
  @PrimaryGeneratedColumn('increment', {
    primaryKeyConstraintName: 'PK_setting_id',
    type: 'bigint',
  })
  id!: ID;

  @Column({ unique: true })
  key: string;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  value: any;
}
