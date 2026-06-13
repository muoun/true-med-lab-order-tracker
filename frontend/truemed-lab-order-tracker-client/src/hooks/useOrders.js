import { useCallback, useEffect, useMemo, useState } from 'react'
import { getOrders } from '../services/orderService'
import { normalizeOrders } from '../utils/validationUtils'

export const useOrders = () => {
  const [orders, setOrders] = useState([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [loadError, setLoadError] = useState('')

  const refreshOrders = useCallback(async () => {
    setIsLoadingOrders(true)
    setLoadError('')

    try {
      const data = await getOrders()
      setOrders(normalizeOrders(data))
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to load orders.')
    } finally {
      setIsLoadingOrders(false)
    }
  }, [])

  useEffect(() => {
    refreshOrders()
  }, [refreshOrders])

  const statCount = useMemo(
    () => orders.filter((order) => String(order.priority || '').toLowerCase() === 'stat').length,
    [orders],
  )

  return {
    orders,
    isLoadingOrders,
    loadError,
    statCount,
    refreshOrders,
  }
}
