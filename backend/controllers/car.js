const express = require("express");
const { handleResponse, handleError } = require('../utils/responses')
const Car = require('../models/car')

exports.car = async (req, res) => {
  const body = req.body;
  try {
    const car_created = await Car.create(body);
    if (car_created) {
        handleResponse(res, { message: 'Data Entered Successfully' })
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return handleError(res, "An error occurred.", 500);
  }
}


