const { Router } = require("express");
const router = Router();
const controller = require("../controllers/app.controller");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/", controller.getHome);
router.get("/sign-up", controller.getSignUp);
router.post("/sign-up", controller.confirmPassword, controller.postSignUp);

router.post("/log-in", controller.logInUser);
router.get("/log-out", controller.logOutUser);

router.post("/upload", upload.single("file"), controller.uploadFile);

module.exports = router;
