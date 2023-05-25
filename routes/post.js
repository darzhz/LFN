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
router.post("/addPost",upload.array('images'),async (req, res,  next) =>{
   /** req.body format example:
   *  {
   * "type": "LOST",
   * "username": "admin",
   * "title": "50km",
   * "src": "[img.png]",
   * "lat": 34.1100,
   * "long": -118.3000
   *  }
   ***/
  let data = req.body;
  const newFileNames = req.fileNames;
  // Access the array of new file names and perform desired actions
  console.log('New file names:', newFileNames);
  //console.log(data);
  let rowsAffected = await model.addPost(data.type,data.username?data.username:'admin',data.title,JSON.stringify(newFileNames),data.lat,data.long,data.desc);
  res.send(rowsAffected);
  //res.send(data.title+" added");
})
module.exports = router;