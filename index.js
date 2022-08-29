import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import 'dotenv/config';

mongoose
  .connect(
    `mongodb+srv://admin:${process.env.NODE_ENV_PASSWORD_MD}@cluster0.3fs3npg.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('11 Hello World!');
});

app.post('/auth/login', (req, res) => {
  const token = jwt.sign(
    {
      email: req.body.email,
      fullName: 'Jack',
    },
    'secret'
  );
  res.json({ success: true, token });
});

app.listen(4444, (err) => {
  if (err) return console.log(err);
  console.log('Server OK');
});
