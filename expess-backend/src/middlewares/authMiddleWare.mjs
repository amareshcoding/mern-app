// Function to verify JWT token
export const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, `${process.env.JWT_SECRET_KEY}`, (err, user) => {
      if (err) return reject(err);
      resolve(user);
    });
  });
};

// Middleware to authenticate user
export const authMiddleWare = (req, res, next) => {
  const token =
    req.cookies.token || req.headers['Authorization']?.split(' ')[1]; // Get token from cookies or headers
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    const verified = jwt.verifyToken(token);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};
