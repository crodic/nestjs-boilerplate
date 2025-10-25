import { EmailField, PasswordField } from '@/decorators/field.decorators';

export class AdminLoginReqDto {
  @EmailField({ toLowerCase: false })
  email!: string;

  @PasswordField()
  password!: string;
}
