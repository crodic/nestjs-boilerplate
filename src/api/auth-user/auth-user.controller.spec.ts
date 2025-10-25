import { Test, TestingModule } from '@nestjs/testing';
import { AuthUserController } from './auth-user.controller';
import { AuthUserService } from './auth-user.service';

describe('AuthUserController', () => {
  let controller: AuthUserController;
  let authUserServiceValue: Partial<Record<keyof AuthUserService, jest.Mock>>;

  beforeAll(async () => {
    authUserServiceValue = {
      signIn: jest.fn(),
      signUp: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthUserController],
      providers: [
        {
          provide: AuthUserService,
          useValue: authUserServiceValue,
        },
      ],
    }).compile();

    controller = module.get<AuthUserController>(AuthUserController);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
