const router = require("express").Router();
const store = require("../controller/store");


router.post(
  "/register",
store.register
);

router.get("/storeslist", store.getStores)
router.post("/storeslots", store.storeSlots)
module.exports = router;
