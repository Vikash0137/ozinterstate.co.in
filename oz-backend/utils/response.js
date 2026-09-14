export const sendSuccess = (res, message = 'Operation successful', data = {}, statusCode = 200, extra = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...extra,
  })
}

export const sendError = (res, message = 'An error occurred', statusCode = 400, errors = null) => {
  const payload = {
    success: false,
    message,
  }
  if (errors) payload.errors = errors
  return res.status(statusCode).json(payload)
}
