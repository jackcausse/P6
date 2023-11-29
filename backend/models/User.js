const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const mongooseExpressErrorHandler = require('mongoose-express-error-handler')

const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
})
const express = require('express')
const app = express()
app.use(mongooseExpressErrorHandler)
// Pour ne pas enregister 2 fois la même adresse email dans la basede donnée
userSchema.plugin(uniqueValidator)

// Exportation du module
module.exports = mongoose.model('User', userSchema)
