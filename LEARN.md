1. Providers: Class NestJs management and inject when needed
   EX: NestJS tự tạo AuthService instance, sẵn sàng inject vào controller hoặc provider khác.

```ts

@Injectable()
export class AuthService {
  login(user) { ... }
}

@Module({
  providers: [AuthService],
})
export class AuthModule {}
```

2. Exports: export service to external module usage

EX: Module khác import AuthModule → có thể inject AuthService mà không cần define lại.

```ts
@Module({
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
```

3. Imports: Import module to use provider has exported

EX:

```ts
@Module({
  imports: [AuthModule],
  controllers: [AppController],
})
export class AppModule {}

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}
}
```

# 1. Tạo thư mục lưu dữ liệu upload

sudo mkdir -p /data/pictshareuploads

# 2. Cấp quyền cho user 1000 (theo image pictshare)

sudo chown 1000 -R /data/pictshareuploads

# 3. Chạy docker compose

sudo docker compose up -d
