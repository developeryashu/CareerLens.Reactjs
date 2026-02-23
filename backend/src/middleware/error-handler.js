function errorHandler(error, _req, res, _next) {
  const status = error.status || 500
  const message = error.message || "Internal server error"

  if (process.env.NODE_ENV !== "production") {
    return res.status(status).json({
      message,
      stack: error.stack,
    })
  }

  return res.status(status).json({ message })
}

module.exports = {
  errorHandler,
}
