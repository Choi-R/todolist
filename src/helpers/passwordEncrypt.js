const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key';

const hashPassword = (password) => bcrypt.hashSync(password, 8);
const comparePassword = (password, hash) => bcrypt.compareSync(password, hash);
const generateToken = (user) => jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });

module.exports = { hashPassword, comparePassword, generateToken, SECRET_KEY };
