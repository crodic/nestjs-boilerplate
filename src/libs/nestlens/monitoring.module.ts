import { Module } from '@nestjs/common';
import { NestLensModule } from 'nestlens';

@Module({
  imports: [
    NestLensModule.forRoot({
      enabled: true,
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
        canAccess: (req) => {
          console.log('Auth check:', req.headers);
          return true; // Test with always true
        },
      },
    }),
  ],
  exports: [NestLensModule],
})
export class MonitoringModule {}
