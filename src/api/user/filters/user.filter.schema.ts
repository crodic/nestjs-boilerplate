import { FilterSchema } from '@/common/types/filter.type';

export const USER_FILTER_SCHEMA = {
  search: { type: 'string', optional: true },
  type: { type: 'number[]', optional: true },
  id: { type: 'number', optional: true },
} satisfies FilterSchema;

/**
 * Example
 *
 * @Get()
findAll(
  @Filter(USER_FILTER_SCHEMA)
  filter: InferFilter<typeof USER_FILTER_SCHEMA>,
) {
  // filter.search -> string | undefined
  // filter.type   -> number[] | undefined
  // filter.id     -> number | undefined

  return this.userService.findAll(filter);
}
 */
