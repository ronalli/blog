import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import 'dotenv/config';

import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

import { registerValidation, loginValidation } from './validations/auth.js';
import checkAuth from './utils/checkAuth.js';
import { postCreateValidation } from './validations/post.js';
import handleValidationErrors from './utils/handleValidationErrors.js';

mongoose
  .connect(process.env.NODE_ENV_MONGODB)
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post(
  '/auth/register',
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.post(
  '/auth/login',
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/uploads', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/tags', PostController.getLastTags);
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post(
  '/posts',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);
app.delete('/posts/:id', checkAuth, PostController.remove);

app.listen(4444, (err) => {
  if (err) return console.log(err);
  console.log('Server OK');
});
