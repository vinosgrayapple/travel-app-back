const { Router } = require('express');
const router = Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('./auth.schema');
// /register
router.post(
  '/register',
  [body('email').isEmail(), body('password').isLength({ min: 5 })],
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const cnd = await User.findOne({ email });
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array(), message: 'Error Register' });
      }

      if (cnd) {
        return res.status(400).send({ message: 'Пользователь существует!' });
      }
      const hashPassword = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        password: hashPassword,
      });
      await user.save();
      res.send(user);
    } catch (e) {
      res.status(5000).json({ message: 'Ошибка регистрации' });
    }
  }
);
// /login
router.post(
  '/login',
  [
    body('email').normalizeEmail().isEmail(),
    body('password').isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), mesage: 'Error login' });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ mesage: 'User Not Found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ mesage: 'User Password Wrong' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.send({ token, userId: user.id });
  }
);

module.exports = router;
