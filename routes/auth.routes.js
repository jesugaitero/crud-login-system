const { Router } = require('express')
const router = Router()

const { isToken, signup, authenticateUser, signout, isAdmin, getUsers, addUser, editUser, deleteUser, deleteManyUsers } = require('../controllers/auth.controller')
const { userSignupValidator } = require("../validator");


//PUBLIC USERS
router.get('/users', getUsers) // ?
router.post('/signup', isToken,userSignupValidator, signup)
router.post('/signin', isToken, authenticateUser)
router.get('/signout', isToken, signout)

//ADMIN USERS
router.post('/add/user', isToken, isAdmin,userSignupValidator, addUser)
router.put('/edit/user/:id', isToken, isAdmin, editUser)
router.delete('/delete/user/:id', isToken, isAdmin, deleteUser)
router.delete('/delete/users', isToken, isAdmin, deleteManyUsers)


module.exports = router;