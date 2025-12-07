
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}

  use(req: any, res: any, next: () => void) {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;

      this.logger.log({
        method,
        url: originalUrl,
        status: res.statusCode,
        duration: `${duration}ms`,
      }, `Application Call API`);
    });

    next();
  }
}
