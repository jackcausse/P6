const fs = require('fs')
const Sauces = require('../models/Sauces')

exports.createSauces = (req, res, next) => {
  const saucesObject = JSON.parse(req.body.sauce)
  delete saucesObject._id
  // delete saucesObject._userId
  const sauces = new Sauces({
    // L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body
    ...saucesObject,
    // userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
  })

  sauces
    .save()
    .then(() => {
      res.status(201).json({message: 'Objet enregistré!'})
    })
    
    .catch((error) => {
      res.status(400).json({message: error})
    })
}

exports.getOneSauces = (req, res, next) => {
  Sauces.findOne({
    _id: req.params.id,
  })
    .then((sauces) => {
      res.status(200).json(sauces)
    })
    .catch((error) => {
      res.status(404).json({
        message: error,
      })
    })
}

exports.modifySauces = (req, res, next) => {
  const saucesObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : {...req.body}

  delete saucesObject._userId
  Sauces.findOne({_id: req.params.id})
    .then((sauces) => {
      if (sauces.userId != req.auth.userId) {
        res.status(401).json({message: 'Non autorisé!'})
      } else {
        Sauces.updateOne(
          {_id: req.params.id},
          {...saucesObject, _id: req.params.id}
        )
          .then(() => res.status(200).json({message: 'Objet modifié!'}))
          .catch((error) => res.status(401).json({message: error}))
      }
    })
    .catch((error) => {
      res.status(400).json({message: error})
    })
}

exports.deleteSauces = (req, res, next) => {
  Sauces.findOne({_id: req.params.id})
    .then((sauces) => {
      if (sauces.userId != req.auth.userId) {
        res.status(401).json({message: 'Non autorisé'})
      } else {
        const filename = sauces.imageUrl.split('/images/')[1]
        fs.unlink(`images/${filename}`, () => {
          Sauces.deleteOne({_id: req.params.id})
            .then(() => {
              res.status(200).json({message: 'Objet supprimé !'})
            })
            .catch((error) => res.status(401).json({message: error}))
        })
      }
    })
    .catch((error) => {
      res.status(500).json({message: error})
    })
}

exports.getAllSauces = (req, res, next) => {
  Sauces.find()
    .then((sauces) => {
      res.status(200).json(sauces)
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      })
    })
}

exports.likeSauces = (req, res, next) => {
  console
    .log('dans le controller de la route likeSauce')

    // .then((sauces) => {
    //   res.status(200).json(sauces)
    // })
    // .catch((error) => {
    //   res.status(404).json({
    //     message: error,
    //   })
    // })
}

