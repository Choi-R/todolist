const express = require('express')
const route = express.Router()
const userC = require('../controllers/userController')
const { authenticate} = require('../middlewares/auth')

route.post('/register', userC.register)
route.post('/register', userC.register)

module.exports = route