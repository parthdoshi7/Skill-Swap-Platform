const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './auth.env' });
const { getDB } = require('../../config/db');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const login = async (req, res) => {
  const db = getDB();
  const { email, password } = req.body;

  console.log('Login attempt:', { email, password });

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  const user = await db.collection('users').findOne({ email });

  console.log('User found:', user);

  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  console.log('Password match:', isMatch);

  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    {
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  res.json({
    message: '✅ Login successful',
    token,
    user: {
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
};

module.exports = { login };
