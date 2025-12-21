import { FilterValueType } from '@/common/types/filter.type';
import { BadRequestException } from '@nestjs/common';

export function parseFilterValue(raw: string, type: FilterValueType) {
  switch (type) {
    case 'number': {
      const v = Number(raw);
      if (Number.isNaN(v)) {
        throw new BadRequestException(`Invalid number: ${raw}`);
      }
      return v;
    }

    case 'number[]': {
      const arr = raw.split(',').map(Number);
      if (arr.some(Number.isNaN)) {
        throw new BadRequestException(`Invalid number array: ${raw}`);
      }
      return arr;
    }

    case 'boolean':
      return raw === 'true';

    case 'string[]':
      return raw.split(',');

    case 'string':
    default:
      return raw;
  }
}
