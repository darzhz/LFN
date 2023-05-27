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
  // Destroy the session and redirect to the login page
  const user = req.session.username;
  req.session.destroy();
  res.send(JSON.stringify({status:'LOGGEDOUT',user:user}))
});
module.exports = router;