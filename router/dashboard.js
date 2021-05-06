const router = require("express").Router();
const dashBoard = require("../controller/dashboard")
const auth = require("../middleware/checkAuthentication")

router.get("/appointments", auth.checkToken, dashBoard.myAppointments);
router.get("/deletedappointments", auth.checkToken,dashBoard.getDeletedAppointments)


module.exports = router;