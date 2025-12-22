import { QuerySort } from '@/common/interfaces/sort.interface';
import { UserEntity } from '../entities/user.entity';

export class UserIdSort implements QuerySort<UserEntity> {
  key = 'id';

  apply(qb, direction) {
    qb.addOrderBy('user.id', direction.toUpperCase() as 'ASC' | 'DESC');
  }
}
