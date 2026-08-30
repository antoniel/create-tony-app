type EdenResult<TData, TError> = {
  data: TData | null | undefined
  error: TError | null | undefined
}

export function edenQueryFn<TData, TError, const TArgs extends readonly unknown[]>(
  method: (...args: TArgs) => Promise<EdenResult<TData, TError>>,
  ...args: TArgs
) {
  return async (): Promise<TData> => {
    const { data, error } = await method(...args)

    if (error) {
      throw error
    }

    if (data == null) {
      throw new Error('Eden returned no data')
    }

    return data
  }
}

export function edenMutationFn<TData, TError, TVariables>(
  method: (variables: TVariables) => Promise<EdenResult<TData, TError>>,
) {
  return async (variables: TVariables): Promise<TData> => {
    const { data, error } = await method(variables)

    if (error) {
      throw error
    }

    if (data == null) {
      throw new Error('Eden returned no data')
    }

    return data
  }
}
