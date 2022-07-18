const router  = require("express").Router();
const auth    = require("../controller/auth")
const tokenAuth = require("../middleware/checkAuthentication")

router.post("/signin",      auth.signin)
router.post("/signup",      auth.signup)
router.get("/confirm/:token/:id",     auth.confirmEmail)
router.get("/authenticated",tokenAuth.checkToken,auth.authenticated)
router.post("/changepassword", tokenAuth.checkToken, auth.changePassword)

module.exports = router;
