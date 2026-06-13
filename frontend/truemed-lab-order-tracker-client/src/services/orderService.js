import { API_ENDPOINTS } from '../config/apiConfig'

export const getOrders = async () => {
  const response = await fetch(API_ENDPOINTS.orders)

  if (!response.ok) {
    throw new Error('Unable to refresh the order list right now.')
  }

  return response.json()
}

export const createOrder = async (payload) => {
  const response = await fetch(API_ENDPOINTS.orders, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const responseBody = await response.json().catch(() => null)

  if (!response.ok) {
    const error = new Error(
      responseBody?.title ||
        responseBody?.message ||
        responseBody?.detail ||
        'The order could not be submitted. Please review the form and try again.',
    )

    error.responseBody = responseBody
    throw error
  }

  return responseBody
}
