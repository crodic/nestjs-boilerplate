import { QueryFilter } from '@/common/interfaces/filter.interface';
import { PostEntity } from '../entities/post.entity';

export class SearchFilter implements QueryFilter<PostEntity, string> {
  key = 'title';

  apply(qb, value: string) {
    qb.andWhere('(post.title ILIKE :q)', {
      q: `%${value}%`,
    });
  }
}
