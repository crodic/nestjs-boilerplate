import {
  StringField,
  StringFieldOptional,
} from '@/decorators/field.decorators';
import { IsPermissionsArray } from '@/decorators/validators/is-permission-array.decorator';

export class CreateRoleReqDto {
  @StringField()
  name: string;

  @StringFieldOptional()
  description?: string;

  @IsPermissionsArray({ message: 'Invalid permissions array' })
  permissions: string[];
}
