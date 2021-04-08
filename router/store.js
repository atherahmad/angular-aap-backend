const router = require("express").Router();
const store = require("../controller/store");


router.post(
  "/register",
store.register
);

module.exports = router;
