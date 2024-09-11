const { Router } = require("express");
const router = Router();
const controller = require("../controllers/app.controller");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  // filename: function (req, file, cb) {
  //   cb(null, file.originalname);
  // },
});
const upload = multer({ storage: storage });

router.get("/", controller.getHome);
router.get("/sign-up", controller.getSignUp);
router.post("/sign-up", controller.confirmPassword, controller.postSignUp);

router.post("/log-in", controller.logInUser);
router.get("/log-out", controller.logOutUser);

router.post("/upload", upload.single("file"), controller.uploadFile);

router.post("/createFolder", controller.createFolder);
router.post("/renameFolder", controller.renameFolderPost);
router.get("/deleteFolder/:id", controller.deleteFolder);

module.exports = router;
