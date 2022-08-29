import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import 'dotenv/config';

import { validationResult } from 'express-validator';
import { registerValidation } from './validations/auth.js';
import UserModel from './models/User.js';

mongoose
  .connect(process.env.NODE_ENV_MONGODB)
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());

app.post('/auth/register', registerValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json(errors.array());

  const password = req.body.password;
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const doc = new UserModel({
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl,
    passwordHash,
  });

  const user = await doc.save();

  return res.json(user);
});

// app.post('/auth/login', (req, res) => {
//   const token = jwt.sign(
//     {
//       email: req.body.email,
//       fullName: 'Jack',
//     },
//     `${process.env.NODE_ENV_SECRET_WORLD}`
//   );
//   res.json({ success: true, token });
// });

app.listen(4444, (err) => {
  if (err) return console.log(err);
  console.log('Server OK');
});
