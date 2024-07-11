const express = require("express");
const router = express.Router();
const { validateRequest } = require("../middlewares/validateRequest");
const { body } = require("express-validator");
const {car } = require("../controllers/car");

router.post(
  '/create-car',
  [
    body('price').notEmpty().withMessage('Price is required'),
    body('phone').notEmpty().withMessage('Price is required'),
    body('country').notEmpty().withMessage('Price is required'),
    body('noOfCopies').notEmpty().withMessage('Price is required'),
    body('price').notEmpty().withMessage('Price is required'),
    body('images').isArray({ min: 1 }).withMessage('At least 1 Image is required'),
  ],
  validateRequest,
  car
);

module.exports = router;
