// ---------------- Импорты ---------------- //
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');
const session = require('express-session');
const fs = require('fs');
const { log } = require('console');

// ---------------- Переменные ---------------- //
const app = express();
const port = 3000;

// ---------------- Middleware ---------------- //
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('client'));
app.use(express.json())
app.use(session({
  secret: 'secretkey', // Замените на свой секретный ключ
  resave: false,
  saveUninitialized: true,
}));
app.use(express.json());


// ---------------- MongoDB ---------------- //
mongoose.connect('mongodb+srv://tekwill123:tekwill123@cluster0.zjcxmi9.mongodb.net/tekwillDB',
  { useNewUrlParser: true },
  { useNewUrlParser: true })
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
  const user = req.session.user;
  if (user) {
    res.status(200).sendFile(__dirname + '/client/pages/profile.html');
  } else {
    res.status(401).json({ error: 'Пользователь не аутентифицирован' });
  }
});

// app.get('/profile', (req, res) => {
//   const user = req.session.user;
//   console.log("User in session(profile):", user)
//   if (user) {
//     res.status(200).sendFile(__dirname + '/client/pages/profile.html');
//   } else {
//     res.status(401).json({ error: 'Пользователь не аутентифицирован' });
//   }
// })

// ---------------- Post запросы ---------------- //
app.post('/register', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    // После успешной регистрации, автоматически аутентифицировать пользователя
    const reqUser = {
      email: newUser.email,
      password: newUser.password
    };
    req.session.user = reqUser;


    res.status(200).redirect('/'); // Перенаправляем пользователя на главную страницу

  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Ошибка при регистрации пользователя' });
  }
});




app.post('/signup', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    console.log(email, password);
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }

    // Сравниваем введенный пароль с хранимым паролем
    if (password === user.password) {
      // Сохраняем только информацию о пользователе в сессии
      // req.session.userId = user._id; // Пример: сохраняем ID пользователя
      const reqUser = {
        email: user.email,
        password: user.password
      };
      req.session.user = reqUser;
      res.redirect('/profile'); // Перенаправляем пользователя
    } else {
      return res.status(401).json({ error: 'Неправильный пароль' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при аутентификации' });
  }
});





app.get('/signout', (req, res) => {
  req.session.destroy()
  res.redirect('/');
})


// ---------------- Запуск сервера ---------------- //
app.listen(port, () => {
  // try {
  //   await mongoose.connect('mongodb+srv://tekwill123:tekwill123@cluster0.zjcxmi9.mongodb.net/tekwillDB', {
  //     useNewUrlParser: true
  //   });
  //   console.log('DB is connected');
  // } catch (error) {
  //   console.error('Failed to connect to DB:', error);
  // }
  console.log('Listening on port', port);
});