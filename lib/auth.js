import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function authenticateToken(handler) {
  return async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ message: 'No token provided' });

    try {
      const user = jwt.verify(token, JWT_SECRET);
      req.user = user;
      return handler(req, res);
    } catch (error) {
      return res.status(403).json({ message: 'Invalid token' });
    }
  };
}