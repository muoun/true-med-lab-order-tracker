export const normalizeFieldKey = (value) =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')

export const normalizeOrders = (data) => {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.orders)) return data.orders
  if (Array.isArray(data?.value)) return data.value
  if (Array.isArray(data?.data)) return data.data
  return []
}
