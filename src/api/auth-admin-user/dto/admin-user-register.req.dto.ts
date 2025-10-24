import { Uuid } from '@/common/types/common.type';
import {
  ClassField,
  EmailField,
  PasswordField,
  StringFieldOptional,
} from '@/decorators/field.decorators';

export class AdminUserRegisterReqDto {
  @EmailField()
  email!: string;

  @PasswordField()
  password!: string;

  @ClassField(() => String)
  roleId!: Uuid;

  @StringFieldOptional()
  username?: string;
}
