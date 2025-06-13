const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'career-secret',
  resave: false,
  saveUninitialized: false
}));

const USERS = { admin: 'password' }; // demo credentials

function requireLogin(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

app.get('/login', (req, res) => {
  res.send(`
    <h1>Login</h1>
    <form method="POST" action="/login">
      <div><label>Username: <input name="username" /></label></div>
      <div><label>Password: <input type="password" name="password" /></label></div>
      <button type="submit">Login</button>
    </form>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (USERS[username] && USERS[username] === password) {
    req.session.user = username;
    res.redirect('/admin/dashboard');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.get('/admin/dashboard', requireLogin, (req, res) => {
  const membersPath = path.join(__dirname, '..', 'members.json');
  const progressPath = path.join(__dirname, 'progress.json');

  const members = JSON.parse(fs.readFileSync(membersPath, 'utf8'));
  let progress = [];
  if (fs.existsSync(progressPath)) {
    progress = JSON.parse(fs.readFileSync(progressPath, 'utf8'));
  }

  const rows = members.map(m => {
    const prog = progress.find(p => p.id === m.id) || { progress: 'N/A', needs: 'N/A' };
    return `<tr><td>${m.name}</td><td>${prog.progress}</td><td>${prog.needs}</td></tr>`;
  }).join('');

  res.send(`
    <h1>Admin Dashboard</h1>
    <table border="1" cellpadding="5">
      <tr><th>Name</th><th>Progress</th><th>Needs</th></tr>
      ${rows}
    </table>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
