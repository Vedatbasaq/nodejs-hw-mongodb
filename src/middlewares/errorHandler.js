export const errorHandler = (err, req, res, next) => {
  const status = 500;
  const message = err?.message || 'Internal Server Error';
  const payload = { status, message };
  if (process.env.NODE_ENV === 'development' && err?.stack) {
    payload.stack = err.stack;
  }
  res.status(status).json(payload);
};
