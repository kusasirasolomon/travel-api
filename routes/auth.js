const express = require("express");

const {
    register,
    login,
    logout
} = require("../controllers/auth");

const router = express.Router();


router.get("/register", (req, res) => {
    res.status(200).json({
        message: "Use POST /auth/register to create an account."
    });
});

router.get("/login", (req, res) => {
    res.status(200).json({
        message: "Use POST /auth/login to log in."
    });
});


router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;