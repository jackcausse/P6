// Importation de fs
// const fs = require('fs')
// Importation de multer
const multer = require('multer')

// Types MIME pris en charge
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
}

// try {
//   const ok = fs.opendirSync('images')
//   // console.log(ok)
// } catch (e) {
//   fs.mkdirSync('images')
// }

// Gère le fichier image
const storage = multer.diskStorage({
  // indique à multer la destination du dossier d'enregistrement
  destination: (req, file, callback) => {
    // console .log(444)
    callback(null, 'images')
        // console.log('555')

  },
  // Indique à multer quel nom de fichier à utiliser
  filename: (req, file, callback) => {
    // console.log('111')
    // remplace les espaces par des underscores pour eviter des probkème côté serveur
    const name = file.originalname.split(' ').join('_')
    const extension = MIME_TYPES[file.mimetype]
    // Ajoute un timestamp
    callback(null, name + Date.now() + '.' + extension)
    // console.log('33')
  },
})

//Exportation du module 
module.exports = multer({storage: storage}).single('image')
