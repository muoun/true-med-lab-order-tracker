import { API_ENDPOINTS } from '../config/apiConfig'
import apiRequest from './api'


export const getOrders = async () => {
  return apiRequest(API_ENDPOINTS.orders, { method: 'GET' }, 'Unable to refresh the order list right now.')
}

export const createOrder = async (payload) => {
  return apiRequest(
    API_ENDPOINTS.orders,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    'The order could not be submitted. Please review the form and try again.',
  )
}
