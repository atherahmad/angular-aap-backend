const router = require("express").Router();
const store = require("../controller/store");


router.post(
  "/register",
store.register
);

router.get("/storeslist", (req,res) => {
  console.log("you reached store path")
  res.json({status:"succcess", message:[{id:1, storeName:"store 1"}, {id:2, storeName:"store 2"}]})
})
module.exports = router;
