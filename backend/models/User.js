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

userSchema.plugin(uniqueValidator)
// userSchema.plugin(mongooseExpressErrorHandler)

module.exports = mongoose.model('User', userSchema)
