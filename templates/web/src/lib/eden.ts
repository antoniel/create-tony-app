interface EdenResponse {
  data: unknown
  error: unknown
  response: Response
  status: number
  headers: HeadersInit | undefined
}

type EdenMethod = (...args: any[]) => Promise<EdenResponse>
type EdenData<TMethod extends EdenMethod> = NonNullable<
  Awaited<ReturnType<TMethod>>['data']
>

export function edenQueryFn<TMethod extends EdenMethod>(
  method: TMethod,
  ...args: Parameters<TMethod>
) {
  return async (): Promise<EdenData<TMethod>> => {
    const { data, error } = await method(...args)

    if (error) throw error

    return data as EdenData<TMethod>
  }
}

export function edenMutationFn<TMethod extends EdenMethod>(method: TMethod) {
  type Variables = Parameters<TMethod>[0]

  return async (variables: Variables): Promise<EdenData<TMethod>> => {
    const args = [variables] as unknown as Parameters<TMethod>
    const { data, error } = await method(...args)

    if (error) throw error

    return data as EdenData<TMethod>
  }
}
