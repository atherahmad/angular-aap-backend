const router = require("express").Router();
const dashBoard = require("../controller/dashboard")
const auth = require("../middleware/checkAuthentication")

router.get("/dashboard", auth.checkToken,dashBoard.myAppointments)


module.exports = router;