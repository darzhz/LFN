const express = require("express");
const bodyParser = require('body-parser')
const app = express();
const model = require("./model/db");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/posts',require('./routes/post.js'));
model.createTable()
app.listen(8080 ,() => {
  console.log('listening on *:8080');
})