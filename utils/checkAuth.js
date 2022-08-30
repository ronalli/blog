import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
  if (token) {
    try {
      const decode = jwt.decode(token, process.env.NODE_ENV_SECRET_WORLD);
      req.userId = decode._id;
      next();
    } catch (error) {
      return res.status(403).json({
        message: 'Нет доступа!',
      });
    }
  }
};
