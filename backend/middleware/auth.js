import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        message: 'Нэвтрэх шаардлагатай' 
      });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production', (err, decoded) => {
      if (err) {
        return res.status(403).json({ 
          message: 'Токен хүчингүй эсвэл дууссан байна' 
        });
      }

      req.userId = decoded.userId;
      next();
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Баталгаажуулалтын алдаа' 
    });
  }
};
