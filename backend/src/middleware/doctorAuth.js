import jwt from 'jsonwebtoken';

export function requireDoctor(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'change-this-development-secret');
    if (payload.role !== 'doctor') return res.status(403).json({ error: 'Doctor access required' });
    req.user = { id: payload.sub, name: payload.name, role: payload.role };
    return next();
  } catch { return res.status(401).json({ error: 'Invalid or expired session' }); }
}
