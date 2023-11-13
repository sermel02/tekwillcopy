// ---------------- Импорты ---------------- //
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');
const session = require('express-session');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// ---------------- Переменные ---------------- //
const app = express();
const port = 3000;

// ---------------- Middleware ---------------- //
app.use(bodyParser.urlencoded({ extended: true })).use(express.static('client')).use(express.json()).use(session({
  secret: 'tekwillProject',
  resave: false,
  saveUninitialized: true,
})).use(express.json());


// ---------------- MongoDB ---------------- //
mongoose.connect('mongodb+srv://tekwill123:tekwill123@cluster0.zjcxmi9.mongodb.net/tekwillDB',
  { useNewUrlParser: true },
  { useUnifiedTopology: true })
  .then(() => {
    console.log('db is connected')
  }).catch(() => {
    console.log('failed to connect');
  });

// ---------------- Функции ---------------- //
function sendModifiedHomePage(req, res) {
  // Читаем содержимое файла `header.html`
  fs.promises.readFile(__dirname + '/client/pages/home.html', 'utf8')
    .then(data => {
      const r1 = `<a href="#" class="header__profile profile modalBtn">
      <div class="profile__icon">
        <span class="material-symbols-outlined">account_circle</span>
      </div>
      <button class="profile__name">Sign In</button>
    </a>`
      const r2 = `
  <a href="/signout" class="header__exit">
    <span>Sign Out</span>
    <span class="material-symbols-outlined">
      logout
    </span>
  </a>`;

      const modifiedHeader = data.replace(r1, r2);


      res.send(modifiedHeader);


    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
  console.log('modified header');
}

function sendDefaultHomePage(req, res) {
  res.sendFile(__dirname + '/client/pages/home.html');
  console.log('default header');
}

// ---------------- Get запросы ---------------- //
app.get('/', (req, res) => {
  const user = req.session.user; // Получаем информацию о пользователе из сессии
  console.log("User in session(home):", user)

  if (user) {
    sendModifiedHomePage(req, res);
  } else {
    sendDefaultHomePage(req, res);
  }
});

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/client/pages/register.html');
  const user = req.session.user; // Получаем информацию о пользователе из сессии
  console.log("User in session(register):", user)
})

app.get('/profile', (req, res) => {
    res.status(200).sendFile(__dirname + '/client/pages/profile.html');
});

// ---------------- Post запросы ---------------- //
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  await User.findOne({ email })
    .exec()
    .then(user => {
      if (user) {
        return res.status(401).json({ message: 'Пользователь с таким email уже существует' });
      } else {
        User.create({ email: email, password: password });
        req.session.user = user;

        res.status(200).redirect('/profile');
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Ошибка сервера' });
    });
});


app.post('/signup', async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;


  await User.findOne({ email })
    .exec()
    .then(user => {
      if (user) {
        if (user.password === password) {
          res.status(200).redirect('/profile');
        } else {
          res.status(401).json({ message: 'Неправильный логин или пароль' });
        }
      } else {
        res.status(401).json({ message: 'Неправильный логин или пароль' });
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Ошибка сервера' });
    });
});

app.get('/signout', (req, res) => {
  req.session.destroy()
  res.redirect('/');
})

// ---------------- Запуск сервера ---------------- //
app.listen(port, () => {
  console.log('Listening on port', port);
});