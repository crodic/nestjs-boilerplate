import { QueryFilter } from '@/common/interfaces/filter.interface';
import { UserEntity } from '../entities/user.entity';

export class SearchFilter implements QueryFilter<UserEntity, string> {
  readonly key = 'search';

  apply(qb, value: string) {
    qb.andWhere('(user.name ILIKE :q OR user.email ILIKE :q)', {
      q: `%${value}%`,
    });
  }
}
