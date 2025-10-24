import { StringField } from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AdminUserRegisterResDto {
  @Expose()
  @StringField()
  userId!: string;
}
