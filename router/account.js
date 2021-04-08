const router = require("express").Router();
const account = require("../controller/account")
const auth = require("../middleware/checkAuthentication")

router.get("/profile", auth.checkToken, account.getProfile)






module.exports = router