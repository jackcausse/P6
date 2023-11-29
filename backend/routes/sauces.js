const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const saucesCtrl = require('../controllers/sauces')

router.post('/', multer, auth, saucesCtrl.createSauces)
router.post('/:id/like', auth, saucesCtrl.likeSauces)
router.put('/:id', auth, multer, saucesCtrl.modifySauces)
router.delete('/:id', auth, saucesCtrl.deleteSauces)
router.get('/:id', auth, saucesCtrl.getOneSauces)
router.get('/', auth, saucesCtrl.getAllSauces)

module.exports = router
