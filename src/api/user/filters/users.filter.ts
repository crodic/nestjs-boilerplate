import { QueryFilter } from '@/common/interfaces/filter.interface';
import { SearchFilter } from './name.filter';
import { TypeFilter } from './type.filter';

export const USER_FILTERS: QueryFilter[] = [
  new SearchFilter(),
  new TypeFilter(),
];
