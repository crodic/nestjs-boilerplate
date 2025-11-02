import { EmailField, PasswordField } from '@/decorators/field.decorators';

export class AdminUserLoginReqDto {
  @EmailField({ toLowerCase: false })
  email!: string;

  @PasswordField()
  password!: string;
}
