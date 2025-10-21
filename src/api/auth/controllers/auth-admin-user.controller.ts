import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller({
  path: 'admin/auth',
  version: '1',
})
export class AuthAdminUserController {}
