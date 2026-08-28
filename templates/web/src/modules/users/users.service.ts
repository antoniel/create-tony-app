import type { Treaty } from '@elysia/eden'
import {
  type QueryClient,
  mutationOptions,
  queryOptions,
} from '@tanstack/react-query'
import { api } from '../../lib/api'
import { edenMutationFn, edenQueryFn } from '../../lib/eden'

export type UsersResponse = Treaty.Data<typeof api.users.get>
export type UsersError = Treaty.Error<typeof api.users.get>
export type CreateUserRequest = Parameters<typeof api.users.post>[0]
export type CreateUserResponse = Treaty.Data<typeof api.users.post>
export type CreateUserError = Treaty.Error<typeof api.users.post>

export const usersService = {
  queryKey: ['users'] as const,
  queryOptions: () =>
    queryOptions<UsersResponse, UsersError>({
      queryKey: usersService.queryKey,
      queryFn: edenQueryFn(api.users.get),
    }),
  createMutationOptions: (queryClient: QueryClient) =>
    mutationOptions<CreateUserResponse, CreateUserError, CreateUserRequest>({
      mutationFn: edenMutationFn(api.users.post),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: usersService.queryKey }),
    }),
}
