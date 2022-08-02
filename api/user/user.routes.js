const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getUser, getUsers, deleteUser, updateUser, addUser } = require('./user.controller')
const router = express.Router()


router.get('/', getUsers)
router.get('/:id', getUser)
// router.put('/:id', requireAuth, requireAdmin, updateUser)
router.put('/:id', requireAuth, updateUser)
router.post('/', requireAuth, requireAdmin, addUser)
router.delete('/:id', requireAuth, requireAdmin, deleteUser)

module.exports = router