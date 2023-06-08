const express = require('express');
const session = require('express-session');
const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(require('./routes'));
app.use(session({
  secret: 'ruangTK',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: true
  }
}))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})