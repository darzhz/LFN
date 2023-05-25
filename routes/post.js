const express = require("express");
const router = express.Router();
const model = require("../model/db");
router.get("/getPost",async (req, res, next) => {
 
  let data = req.body;
  let result = await model.getPost(data.lat, data.long, data.searchRadius, data.type);
  res.send(result);
});
router.post("/addPost",async (req, res,  next) =>{
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
  let rowsAffected = await model.addPost(data.type,data.username,data.title,data.src,data.lat,data.long);
  res.send(rowsAffected);
  //res.send(data.title+" added");
})
module.exports = router;