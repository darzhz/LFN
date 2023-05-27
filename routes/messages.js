const express = require("express");
const router = express.Router();
const model = require("../model/db");
const authenticateMiddleware = (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    res.send(JSON.stringify({status:"UNAUTHENTICATED"}));
  }
};
router.post('/getMessages', authenticateMiddleware,async (req, res) => {
  // Destroy the session and redirect to the login page
  const data = req.body;
  const user = req.session.username;
  const result = await model.getMessages(data.pid, user, data.username);
  res.send(result);
});
router.post('/sendMessages', authenticateMiddleware,async (req, res) => {
  // Destroy the session and redirect to the login page
  const data = req.body;
  const user = req.session.username;
  const result = await model.setMessages(data.pid, user, data.username,data.message);
  res.send(result);
});
router.get('/getMessageList', authenticateMiddleware,async (req, res) => {
  const user = req.session.username;
  const result = await model.getMessageList(user);
  res.send(result);
});
module.exports = router;