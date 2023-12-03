// Importation de mongoose
const mongoose = require('mongoose')
const mongooseExpressErrorHandler = require('mongoose-express-error-handler')


// Champs du formulaire de création de la sauce
const sauceSchema = mongoose.Schema({
  userId: {type: String, required: true},
  name: {type: String, required: true},
  manufacturer: {type: String, required: true},
  description: {type: String, required: true},
  mainPepper: {type: String, require: true},
  imageUrl: {type: String, required: true},
  heat: {type: Number, required: true},
  likes: {default: 0, type: Number, required: true},
  dislikes: {default: 0, type: Number, required: true},
  usersLiked: {type: [], required: true},
  usersDisliked: {type: [], required: true},
})

// Exportation du module
module.exports = mongoose.model('Sauce', sauceSchema)
