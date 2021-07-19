const express = require('express');

const router = express.Router();

const UserController = require("../controllers/user.controller");

// SIGN UP - For creating a new User
router.post("/signup", UserController.createUser);

//LOGIN - For checking if User exists and returning a session
router.post("/login", UserController.loginUser);

module.exports = router;