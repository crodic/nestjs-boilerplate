import { Uuid } from '@/common/types/common.type';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('settings')
export class SettingEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_setting_id',
  })
  id!: Uuid;

  @Column({ unique: true })
  key: string;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  value: any;
}
