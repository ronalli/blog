import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';

import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

import { registerValidation, loginValidation } from './validations/auth.js';
import checkAuth from './utils/checkAuth.js';
import { postCreateValidation } from './validations/post.js';

mongoose
  .connect(process.env.NODE_ENV_MONGODB)
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());

app.post('/auth/register', registerValidation, UserController.register);

app.post('/auth/login', loginValidation, UserController.login);

app.post('/auth/me', checkAuth, postCreateValidation, UserController.getMe);

// app.get('/posts', PostController.getAll);
// app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, PostController.create);
// app.patch('/posts/:id', PostController.delete);
// app.delete('/posts/:id', PostController.remove);

app.listen(4444, (err) => {
  if (err) return console.log(err);
  console.log('Server OK');
});
