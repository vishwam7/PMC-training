const bodyParser = require('body-parser');
const express = require('express');
const authController = require('./../controller/authController');
const userController = require('./../controller/userController');
const router = express.Router();

router.post('/signup', bodyParser.json(), authController.signup);
router.post('/login', bodyParser.json(), authController.login);

router.post('/forgotPassword', bodyParser.json(), authController.forgotPassword);
router.patch('/resetPassword/:token', bodyParser.json(), authController.resetPassword);

router.route('/').get(userController.getAllUsers)

module.exports = router;