const jwt = require('jsonwebtoken')
const logger = require('./logger')
const User = require('../models/user')

const handleError = (error, request, response, next) => {
  if (process.env.NODE_ENV !== 'test') {
    logger.error(error)
  }

  if (error.name === 'CastError') {
    response.status(400).json({
      error: 'Invalid id'
    })
  }

  if (error.name === 'ValidationError') {
    response.status(400).json({
      error: `Invalid request: ${error.message}`
    })
  }

  next(error)
}

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({
    error: 'unknown endpoint'
  })
  next()
}

const tokenExtractor = (request, response, next) => {
  const auth = request.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    request.token = auth.substring(7)
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const { token } = request
  if (!token) {
    return response.status(401).json({
      error: 'token invalid or missing'
    })
  }
  const tokenContent = jwt.verify(token, process.env.SECRET)
  if (!tokenContent.id) {
    return response.status(401).json({
      error: 'token missing or invalid here'
    })
  }

  const user = await User.findById(tokenContent.id)
  if (!user) {
    return response.status(401).json({
      error: 'invalid or missing token'
    })
  }

  request.user = user

  next()
}

module.exports = {
  handleError,
  unknownEndpoint,
  tokenExtractor,
  userExtractor
}
