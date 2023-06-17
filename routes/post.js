const express = require("express");
const router = express.Router();
const model = require("../model/db");
const multer = require('multer');
const path = require("path");
const sharp = require("sharp");
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadPath = path.join(__dirname,'..','uploads');
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     const newFileName = Date.now() + '-' + file.originalname;
//     if (!req.fileNames) {
//       req.fileNames = []; 
//     }
//     req.fileNames.push(newFileName);
//     cb(null, newFileName);
//   }
// });
// const upload = multer({ storage });
const upload = multer({
  storage: multer.memoryStorage() 
});
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
  //const newFileNames = req.fileNames;
  const newFileNames = [];
  // Convert images to WebP format
  await Promise.all(
    req.files.map(async (file) => {
      const newFileName = Date.now() + '-' + file.originalname+'.webp';
      newFileNames.push(newFileName);

      let imageProcessor = sharp(file.buffer);
      // Check the file type and apply appropriate compression
      if (file.mimetype === 'image/png') {
        imageProcessor.png({ compressionLevel: 5 }); // Adjust the compressionLevel value for PNG
      } else if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        imageProcessor.jpeg({ quality: 70 }); // Adjust the quality value for JPEG
      }
      await imageProcessor
        .toFormat("webp")
        .toFile(`uploads/${newFileName}`);
    })
  );
  console.log('New file names:', newFileNames);
   req.files = null;
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