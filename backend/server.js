// Importe le package http de Node.js
const http = require('http')
// Importe l'application App.js
const app = require('./app')

// Teste et renvois le port d'après les paramètres passés
const normalizePort = (val) => {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  }
  if (port >= 0) {
    return port
  }
  return false
}

// Défini le port d'écoute, en premier celui défini dans les variables d'environnement, sinon 3000
const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

// Constante qui récupère la valeur d'erreur
const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error
  }
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port
  switch (error.code) {
    // Autorisation refusée
    case 'EACCES':
      console.error(bind + 'requires elevated privileges.')
      process.exit(1)
      break
    // Adresse déjà utilisée
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.')
      process.exit(1)
      break
    default:
      throw error
  }
}

// Création du serveur en passant l'application express
const server = http.createServer(app)

// Gestion des erreur serveur
server.on('error', errorHandler)

// Met en écoute et affiche dans la console le port utilisé
server.on('listening', () => {
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
  console.log('Listening on' + bind)
})

// Serveur en écoute
server.listen(port)
