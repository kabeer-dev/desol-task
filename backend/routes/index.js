const express = require('express')
const router = express.Router()
const fs = require('fs')
const { verifyToken } = require("../middlewares/verifyToken");

fs.readdirSync(__dirname).forEach(function (file) {
    if (file === 'index.js') return
    var name = file.substring(0, file.indexOf('.'));
    if (name === 'auth') {
        router.use('/' + name, verifyToken, require('./' + name))
    } else {
        router.use('/' + name, verifyToken, require('./' + name));
    }
})

module.exports = router;