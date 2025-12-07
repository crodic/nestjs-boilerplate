import { MiddlewareConsumer, Module } from '@nestjs/common';
import generateModulesSet from './utils/modules-set';
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  imports: generateModulesSet(),
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
