const express = require("express");
const bodyParser = require('body-parser')
const app = express();
const model = require("./model/db");
const path = require("path");
const session = require("express-session");
const SQLiteStore = require('connect-sqlite3')(session);

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({
    db: 'ses.db',
    dir: 'sessions', // Create a directory named 'sessions' to store session data
    table: 'sessions'
  })
}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const build = path.join(__dirname, "svelte/public");
const uploads = path.join(__dirname,"uploads")
app.use(express.static(build));
app.use('/images',express.static(uploads));
app.use('/posts',require('./routes/post.js'));
app.use('/register',require('./routes/register.js'));
app.use('/login',require('./routes/login.js'));
app.use('/logout',require('./routes/logout.js'));
app.use('/messages',require('./routes/messages.js'));
model.createTable()
app.listen(8080 ,() => {
  console.log('listening on *:8080');
})