const express = require("express")
const router = express.Router();

const {signUp,sendotp, logIn,logout} = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");
const { me,isAuth } = require("../middleware/auth");


router.post("/signup",signUp);
router.post("/login",logIn);
router.post("/sendotp",sendotp);
router.post("/logout", logout);

router.get("/is-auth", isAuth);
router.get("/me", authenticate, me);


module.exports = router;