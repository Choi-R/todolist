const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize');
const { success, error, serverError } = require('../helpers/response')
const { emptyBody } = require('../helpers/validation')
const { sequelize, User } = require('../models')

// New User Registration
exports.register = async (req, res) => {
    const { username, password } = req.body
    try {
        // Check body empty
        const emptyMessage = emptyBody({ username, password })
        if (emptyMessage) { return error(res, emptyMessage, 400) }

        // Check user exist
        const user = await User.findOne({
            where: { username }
        })
        if (user) { return error(res, `Username already exist`, 400) }

        // Registration process
        const hashed = await bcrypt.hash(password, 10)
        userBody = {
            username,
            password: hashed
        }
        const newUser = await User.create(userBody)

        // Login
        const token = jwt.sign({ id: newUser.id }, process.env.SECRET_KEY, { expiresIn: '24h' })
        return success(res, token, 201)
    }
    catch (err) { return serverError(res, err) }
}

// Login
exports.login = async (req, res) => {
    const { username, password } = req.body
    try {
        // Check input
        const emptyMessage = emptyBody({ username, password })
        if (emptyMessage) { return error(res, emptyMessage, 400) }

        const user = await User.findOne({
            where: { username }
        })
        if (!user) { return error(res, `Account doesn't exist`, 400) }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) { return error(res, `Incorrect username or password`, 400) }

        // Login
        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '24h' })
        return success(res, token, 200)
    }
    catch (err) { return serverError(res, err) }
}