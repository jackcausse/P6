
// Importations
const express = require('express')

// Importation du middleware passwords 
const password = require('../middleware/password')

// La fonction router
const router = express.Router()

// Importation du controller/user.js
const userCtrl = require('../controllers/user')

// Route pour la création d'utilisateur ou le login
router.post('/signup', password, userCtrl.signup)
router.post('/login', userCtrl.login)

// Exportation du module
module.exports = router
