const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  try {

    console.log("process.env.JWT_SECRET:", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("TOKEN DECODED:", decoded);

    req.user = decoded; 
    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);
    return res.status(403).json({ message: 'Token invalide' });
  }
};

module.exports = verifyToken;