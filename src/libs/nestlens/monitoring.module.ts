import { Module } from '@nestjs/common';
import { NestLensModule } from 'nestlens';

@Module({
  imports: [
    NestLensModule.forRoot({
      enabled: process.env.NODE_ENV === 'development',
      storage: {
        driver: 'redis',
        memory: { maxEntries: 100000 },
        redis: {
          host: process.env.REDIS_HOST || '127.0.0.1',
          port: Number(process.env.REDIS_PORT) || 6379,
          password: process.env.REDIS_PASSWORD || undefined,
        },
      },
      watchers: {
        query: { slowThreshold: 100, enabled: true },
        exception: { enabled: true },
        log: true,
        cache: true,
        mail: true,
      },
      authorization: {
        canAccess: () => {
          return true;
        },
      },
    }),
  ],
  exports: [NestLensModule],
})
export class MonitoringModule {}
