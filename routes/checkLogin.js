const express = require("express");
const router = express.Router();
const authenticateMiddleware = (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    res.send(JSON.stringify({status:"UNAUTHENTICATED"}));
  }
};
router.get('/', authenticateMiddleware,(req, res) => {
  const user = req.session.username;
  res.send(JSON.stringify({status:'LOGGEDIN',user:user}))
});
module.exports = router;