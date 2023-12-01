const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const mongooseExpressErrorHandler = require('mongoose-express-error-handler')

// Schéma d'utilisateur
const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
})

const express = require('express')
const app = express()
  // Pour ne pas enregister 2 fois la même adresse email dans la base de donnée
  userSchema.plugin(uniqueValidator)

// Etend la gestion des contrôle d'erreurs
app.use(mongooseExpressErrorHandler)

// Exportation du module
module.exports = mongoose.model('User', userSchema)
