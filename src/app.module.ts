import { Module } from '@nestjs/common';
import { NotificationGatewayModule } from './src/api/notification-gateway/notification-gateway.module';
import generateModulesSet from './utils/modules-set';

@Module({
  imports: generateModulesSet(),
})
export class AppModule {}
