const router = require("express").Router();
const appointment = require("../controller/appointment");


router.post(
  "/new",
appointment.newAppointment
);


module.exports = router;
