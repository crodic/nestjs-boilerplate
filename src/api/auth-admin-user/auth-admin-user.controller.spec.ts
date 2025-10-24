import { Test, TestingModule } from '@nestjs/testing';
import { AuthAdminUserController } from './auth-admin-user.controller';
import { AuthAdminUserService } from './auth-admin-user.service';

describe('AuthAdminUserController', () => {
  let controller: AuthAdminUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthAdminUserController],
      providers: [AuthAdminUserService],
    }).compile();

    controller = module.get<AuthAdminUserController>(AuthAdminUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
