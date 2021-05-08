const router = require("express").Router();
const appointment = require("../controller/appointment");
const auth = require("../middleware/checkAuthentication")


router.post(
  "/new",auth.checkToken,
appointment.newAppointment
);
router.post(
  "/delete",auth.checkToken,
appointment.deleteAppointment
);
router.get(
  "/details/:id",auth.checkToken,
appointment.appoinmetnDetails
);

module.exports = router;
