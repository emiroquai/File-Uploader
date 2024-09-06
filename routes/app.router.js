const { Router } = require("express");
const router = Router();
const controller = require("../controllers/app.controller");

router.get("/", controller.getHome);
router.get("/sign-up", controller.getSignUp);
router.post("/sign-up", controller.confirmPassword, controller.postSignUp);

router.post("/log-in", controller.logInUser);
router.get("/log-out", controller.logOutUser);

module.exports = router;
