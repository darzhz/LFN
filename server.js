const express = require("express");
const bodyParser = require('body-parser')
const app = express();
const model = require("./model/db");
const path = require("path");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const build = path.join(__dirname, "svelte/public");

app.use(express.static(build));
app.use('/posts',require('./routes/post.js'));
model.createTable()
app.listen(8080 ,() => {
  console.log('listening on *:8080');
})