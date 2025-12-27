import { QuerySort } from '@/common/interfaces/sort.interface';
import { SelectQueryBuilder } from 'typeorm';
import { PostEntity } from '../entities/post.entity';

export class IdSort implements QuerySort<PostEntity> {
  key = 'id';

  apply(qb: SelectQueryBuilder<PostEntity>, direction: 'asc' | 'desc') {
    qb.addOrderBy('post.id', direction.toUpperCase() as 'ASC' | 'DESC');
  }
}

export class TitleSort implements QuerySort<PostEntity> {
  key = 'title';

  apply(qb: SelectQueryBuilder<PostEntity>, direction: 'asc' | 'desc') {
    qb.addOrderBy('post.title', direction.toUpperCase() as 'ASC' | 'DESC');
  }
}

export const POST_SORTS: QuerySort<PostEntity>[] = [
  new IdSort(),
  new TitleSort(),
];

export class ColumnSort<TEntity> implements QuerySort<TEntity> {
  constructor(
    public key: string,
    private columnPath: string,
  ) {}

  apply(qb: SelectQueryBuilder<TEntity>, direction: 'asc' | 'desc') {
    qb.addOrderBy(this.columnPath, direction.toUpperCase() as 'ASC' | 'DESC');
  }
}

export const POST_SORTS_V2 = [
  new ColumnSort('id', 'post.id'),
  new ColumnSort('title', 'post.title'),
  new ColumnSort('createdAt', 'post.createdAt'),
];
