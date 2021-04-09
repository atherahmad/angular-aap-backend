const router = require("express").Router();
const appointment = require("../controller/appointment");
const auth = require("../middleware/checkAuthentication")


router.post(
  "/new",auth.checkToken,
appointment.newAppointment
);


module.exports = router;
