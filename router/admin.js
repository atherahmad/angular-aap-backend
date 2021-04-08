const router = require("express").Router();
const admin = require("../controller/admin");
const adminAuth = require("../middleware/adminAuthentication");
const auth = require("../controller/auth");
const account = require("../controller/account");
const uploads = require("../controller/uploads");
const upload = require("../middleware/multer");

router.get("/getquerries", adminAuth.adminAuthCheck, admin.querriesList);
router.get("/querrydetails/:id", adminAuth.adminAuthCheck, admin.querryDetails);
router.post("/handlequerry", adminAuth.adminAuthCheck, admin.querryHandler);

router.get("/getuserlist", adminAuth.adminAuthCheck, admin.usersList);
router.get(`/userdetails/:userId`, adminAuth.adminAuthCheck, admin.userDetails);

router.post("/updateuser", adminAuth.adminAuthCheck, admin.updateUser);

router.post("/changepassword", adminAuth.adminAuthCheck, auth.changePassword);
router.get("/profile", adminAuth.adminAuthCheck, account.getProfile);
router.post(
  "/editprofile",
  adminAuth.adminAuthCheck,
  upload.single("file"),
  uploads.profile
);

module.exports = router;
