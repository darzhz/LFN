const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const model = require("../model/db");
router.post("/",async (req, res, next) => {
  let data = req.body;
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.error(err);
      return;
    }

    bcrypt.hash(password, salt,async (err, hashedPassword) => {
      if (err) {
        console.error(err);
        return;
      }
      let result = await model.addNewUser(username,email,hashedPassword);
      if(result==null){
      	res.send(JSON.stringify({status:"USERNAME_UNAVAILABLE"}))
      }else{
      res.send(JSON.stringify({status:'OK'}));
  		}
      });
    });
});
module.exports = router;