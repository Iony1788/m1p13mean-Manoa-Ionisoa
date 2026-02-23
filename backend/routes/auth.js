const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authController = require('../controllers/authController');


const JWT_SECRET = process.env.JWT_SECRET ; 


router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;



