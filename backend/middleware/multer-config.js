// Importation de multer
const multer = require('multer')

// Types MIME pris en charge
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
}

// Gère le fichier image
const storage = multer.diskStorage({

  // indique à multer la destination du dossier d'enregistrement
  destination: (req, file, callback) => {
    callback(null, 'images')
  },
  // Indique à multer quel nom de fichier à utiliser
  filename: (req, file, callback) => {
  
    // remplace les espaces par des underscores pour eviter des problèmes côté serveur
    const name = file.originalname.split(' ').join('_')
    const extension = MIME_TYPES[file.mimetype]
    // Ajoute un timestamp
    callback(null, name + Date.now() + '.' + extension)
  
  },
})

//Exportation du module 
module.exports = multer({storage: storage}).single('image')
