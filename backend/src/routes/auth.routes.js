const { Router } = require('express')
const { login, me } = require('../controllers/auth.controller')
const { verificarToken } = require('../middlewares/auth.middleware')

const router = Router()

router.post('/login', login)
router.get('/me', verificarToken, me)

module.exports = router