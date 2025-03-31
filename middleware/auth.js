// middleware/auth.js
const jwt = require('jsonwebtoken');
const Club = require('../models/Club');

exports.protect = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).send('Access denied.');
  // console.log(token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded,'test3');
    req.club = await Club.findById(decoded.id);
    // console.log(req.club)
    next();
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
};

exports.admin = (req, res, next) => {
  if (!req?.club?.isAdmin) return res.status(403).send('Access denied.');
  next();
};
