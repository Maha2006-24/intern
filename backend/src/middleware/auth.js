function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer demo-token') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

export { auth };
