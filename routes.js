const express = require('express')
const router = express.Router();
const {checkRegister, checkLogin} = require('./helper/middlewares')
const {checkToken} = require ('./helper/jwt')


const authService = require('./service/auth')

router.post('/user/login', checkLogin, authService.login)
router.post('/user/register', checkRegister, authService.register)
router.patch('/user/deactive', checkToken, authService.deactiveAccount);
router.patch('/user/activate', checkToken, authService.activateAccount);
router.patch("/user/close", checkToken, authService.closeAccount);

module.exports = router