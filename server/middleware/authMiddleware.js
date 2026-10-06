import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {  //req = incoming requests (headers,body,url), res = response, next = pass along to next handler
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export default authMiddleware;
