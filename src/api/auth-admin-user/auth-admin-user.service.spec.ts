import { Test, TestingModule } from '@nestjs/testing';
import { AuthAdminUserService } from './auth-admin-user.service';

describe('AuthAdminUserService', () => {
  let service: AuthAdminUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthAdminUserService],
    }).compile();

    service = module.get<AuthAdminUserService>(AuthAdminUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
