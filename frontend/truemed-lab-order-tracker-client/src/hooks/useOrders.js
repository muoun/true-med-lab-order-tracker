import { useCallback, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getOrders } from '../services/orderService'
import { normalizeOrders } from '../utils/validationUtils'

const ORDERS_QUERY_KEY = ['orders']

export const useOrders = () => {
  const queryClient = useQueryClient()

  const { data = [], isLoading, error } = useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: async () => {
      const response = await getOrders()

      return normalizeOrders(response)
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  })

  const refreshOrders = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY })
  }, [queryClient])

  const statCount = useMemo(
    () => data.filter((order) => String(order.priority || '').toLowerCase() === 'stat').length,
    [data],
  )

  return {
    orders: data,
    isLoadingOrders: isLoading,
    loadError: error instanceof Error ? error.message : '',
    statCount,
    refreshOrders,
  }
}
