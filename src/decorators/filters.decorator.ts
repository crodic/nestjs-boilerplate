import { FilterSchema } from '@/common/types/filter.type';
import { parseFilterValue } from '@/utils/filter.parser';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Filters = <S extends FilterSchema>(schema: S) =>
  createParamDecorator((_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const rawFilter = req.query?.filter ?? {};

    const result: Record<string, any> = {};

    Object.entries(schema).forEach(([key, config]) => {
      const rawValue = rawFilter[key];

      if (typeof rawValue !== 'string') {
        if (!config.optional) {
          return;
        }
        return;
      }

      result[key] = parseFilterValue(rawValue, config.type);
    });

    return result;
  })();
