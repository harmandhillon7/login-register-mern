import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

// Use the extended option to parse URL-encoded data with querystring library.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

mongoose
  .connect('mongodb://localhost:27017/myLoginRegisterDB')
  .then(() => {
    console.log('Mongo connected!');
  })
  .catch((err) => {
    console.log(err);
  });

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = new mongoose.model('User', userSchema);

app.get('/login', (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (user) {
      if (password === user.password) {
        res.send({ message: 'Login successfully', user: user });
      } else {
        res.send({ message: 'Incorrect Password' });
      }
    } else {
      res.send({ message: 'User not registered.' });
    }
  });
});

app.get('/signup', (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email: email }).then((user) => {
    if (user) {
      res.send({ message: 'User already registered' });
    } else {
      const user = new User({
        name,
        email,
        password,
      });

      user.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.send({ message: 'Successfully registered' });
        }
      });
    }
  });
});

app.listen(8000, () => {
  console.log('Server started!');
});

