const express = require("express");
const router = express.Router();
const User = require("../model/user.js"); // Ensure User model is required
const warpAsync = require("../utils/warpAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");


router.get("/signup", userController.rendersignup);

router.post("/signup", warpAsync(userController.signup));

router.get("/login", userController.renderlogin );

router.post("/login", saveRedirectUrl,  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login"
}), warpAsync(userController.login));

router.get("/logout", userController.logout);

module.exports = router;

