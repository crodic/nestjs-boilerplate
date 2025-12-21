import { QueryFilter } from '@/common/interfaces/filter.interface';
import { UserEntity } from '../entities/user.entity';

export class TypeFilter implements QueryFilter<UserEntity, number[]> {
  readonly key = 'type';

  apply(qb, value: number[]) {
    qb.andWhere('user.type IN (:...types)', {
      types: value,
    });
  }
}
