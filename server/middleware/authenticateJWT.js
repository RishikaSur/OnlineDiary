import jwt from 'jsonwebtoken';

export default function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }
      req.user = user; // Attach user info (e.g., id) to request object
      next();
    });
  } else {
    res.status(401).json({ message: 'Authorization header missing or malformed' });
  }
}


