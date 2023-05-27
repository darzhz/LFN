const express = require("express");
const router = express.Router();
const model = require("../model/db");
const multer = require('multer');
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname,'..','uploads');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const newFileName = Date.now() + '-' + file.originalname;
    if (!req.fileNames) {
      req.fileNames = []; 
    }
    req.fileNames.push(newFileName);
    cb(null, newFileName);
  }
});
const upload = multer({ storage });
router.post("/getPost",async (req, res, next) => {
  let data = req.body;
  let result = await model.getPost(data.lat, data.long, data.searchRadius, data.type);
  res.send(result);
});
const authenticateMiddleware = (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    res.send(JSON.stringify({status:"UNAUTHENTICATED"}));
  }
};
router.post("/addPost",authenticateMiddleware, upload.array('images'),async (req, res,  next) =>{
  let data = req.body;
  const newFileNames = req.fileNames;
  console.log('New file names:', newFileNames);
  let result = await model.addPost(data.type,req.session.username,data.title,JSON.stringify(newFileNames),data.lat,data.long,data.desc);
  res.send(result);
});
router.post("/deletePost",authenticateMiddleware,async (req, res,  next) =>{
  let data = req.body;
  let rowsAffected = await model.deletePost(data.pid);
  res.send(rowsAffected);
});
router.get('/getUserPost',authenticateMiddleware,async (req, res, next) =>{
  res.send(await model.getUserPosts(req.session.username));
})
module.exports = router;