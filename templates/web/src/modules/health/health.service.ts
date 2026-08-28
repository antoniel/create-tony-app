import type { Treaty } from '@elysia/eden'
import { queryOptions } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { edenQueryFn } from '../../lib/eden'

export type HealthResponse = Treaty.Data<typeof api.health.get>
export type HealthError = Treaty.Error<typeof api.health.get>

export const healthService = {
  queryKey: ['health'] as const,
  queryOptions: () =>
    queryOptions<HealthResponse, HealthError>({
      queryKey: healthService.queryKey,
      queryFn: edenQueryFn(api.health.get),
    }),
}
