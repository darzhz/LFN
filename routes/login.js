const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const model = require("../model/db");
router.post("/",async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username exists in the database
  const row = await model.checkAvailable(username);
  console.log(row);
    if (row.length > 0) {
      bcrypt.compare(password, row[0].saltedhash, (err, result) => {
        if (err) {
          console.error(err);
          return;
        }

        if (result) {
          // Authentication successful
          req.session.username = username; // Store the username in the session
          //res.redirect('/dashboard');
          res.send(JSON.stringify({status:'AUTHENTICATED',user:username}))
        } else {
          // Authentication failed
          res.send({status:'INVALID'});
        }
      });
    } else {
      // Authentication failed
      res.send({status:'INVALID'});
    }
  });
module.exports = router;
