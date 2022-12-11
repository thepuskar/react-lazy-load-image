import { useEffect, useReducer, useRef } from 'react'

interface State<T> {
  data?: T
  error?: Error
  loading?: boolean
}

type Cache<T> = { [url: string]: T }

type Action<T> =
  | { type: 'loading' }
  | { type: 'fetched'; payload: T }
  | { type: 'error'; payload: Error }

export function useFetch<T = unknown>(
  url?: string,
  options?: RequestInit
): State<T> {
  const cache = useRef<Cache<T>>({})
  const cancelRequest = useRef<boolean>(false)

  const initialState: State<T> = {
    error: undefined,
    data: undefined,
    loading: false
  }

  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action?.type) {
      case 'loading':
        return { ...initialState, loading: true }
      case 'fetched':
        return { ...initialState, data: action?.payload }
      case 'error':
        return { ...initialState, error: action?.payload }

      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(fetchReducer, initialState)

  useEffect(() => {
    if (!url) return

    cancelRequest.current = false

    const fetchData = async () => {
      dispatch({ type: 'loading' })

      //if cache exists, return it
      if (cache?.current[url]) {
        dispatch({ type: 'fetched', payload: cache.current[url] })
      }

      try {
        const response = await fetch(url, options)
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        const data = (await response.json()) as T
        // console.log('data', data)
        cache.current[url] = data

        if (cancelRequest.current) return

        dispatch({ type: 'fetched', payload: data })
      } catch (err) {
        if (cancelRequest) return
        dispatch({ type: 'error', payload: err as Error })
      }
    }
    void fetchData()
    return () => {
      cancelRequest.current = true
    }
  }, [url])
  return state
}
