const apiRequest = async (url, options = {}, fallbackErrorMessage) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const responseBody = await response.json().catch(() => null)

  if (!response.ok) {
    const error = new Error(
      responseBody?.title ||
        responseBody?.message ||
        responseBody?.detail ||
        fallbackErrorMessage ||
        'The request could not be completed right now.',
    )

    error.responseBody = responseBody
    throw error
  }

  return responseBody
}

export default apiRequest
