const express = require("express");
const router = express.Router();
const { validateRequest } = require("../middlewares/validateRequest");
const { body } = require("express-validator");
const { login } = require("../controllers/auth");

router.post(
  '/login',
  [
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Not a Valid Email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  login
);

module.exports = router;
