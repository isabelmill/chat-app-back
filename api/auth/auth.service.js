const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')


async function login(email, password) {
    logger.debug(`auth.service - login with email: ${email}`)
    const user = await userService.getByEmail(email)
    if (!user) return Promise.reject('Invalid email or password')
    const match = await bcrypt.compare(password, user.password)
    if (!match || user.email !== email) return Promise.reject('Invalid email or password')
    delete user.password
    user._id = user._id.toString()
    return user
}


async function signup(username, password, fullname, email, isAdmin, img, friendList) {
    logger.debug(`auth.service - signup with email: ${email}, fullname: ${fullname}`)
    if (!email || !password || !fullname || !username || !img) return Promise.reject('fullname, username and password are required!')

    const userExist = await userService.getByEmail(email)
    if (userExist) return Promise.reject('Email already taken')

    const hash = await encryptPassword(password)
    return userService.add({ username, password: hash, fullname, email, isAdmin, img, friendList })
}

async function encryptPassword(password) {
    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds)
    return hash
}

module.exports = {
    signup,
    login,
    encryptPassword
}