import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ClsModule } from 'nestjs-cls';
import { join } from 'path';
import { AdminUserModule } from './admin-user/admin-user.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { AuthModule } from './auth/auth.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { HealthModule } from './health/health.module';
import { HomeModule } from './home/home.module';
import { PostModule } from './post/post.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    UserModule,
    HealthModule,
    AuthModule,
    HomeModule,
    PostModule,
    AuditLogModule,
    RoleModule,
    AdminUserModule,
    FileUploadModule,
    NotificationModule,
  ],
})
export class ApiModule {}
