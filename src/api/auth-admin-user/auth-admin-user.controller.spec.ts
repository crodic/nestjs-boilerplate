import { Test, TestingModule } from '@nestjs/testing';
import { AuthAdminUserController } from './auth-admin-user.controller';
import { AuthAdminUserService } from './auth-admin-user.service';

describe('AuthAdminUserController', () => {
  let controller: AuthAdminUserController;
  let authAdminUserServiceValue: Partial<
    Record<keyof AuthAdminUserService, jest.Mock>
  >;

  beforeAll(async () => {
    authAdminUserServiceValue = {
      signIn: jest.fn(),
      signUp: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthAdminUserController],
      providers: [
        {
          provide: AuthAdminUserService,
          useValue: authAdminUserServiceValue,
        },
      ],
    }).compile();

    controller = module.get<AuthAdminUserController>(AuthAdminUserController);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
