const logger = require('./logger.js')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('Token: ', request.headers.authorization)
    logger.info('---')
    next()
  }
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError'){
      return response.status(401).json({ error: error.message })
    }
    next(error)
  }

  const tokenExtractor = (request, response, next) => {
    
    const authorization = request.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')){
      const token = authorization.replace('Bearer ','')
      request.token = token
    }else{
      request.token = null
    }
    
    next()
  }

  const userExtractor = async(request, response,next )=>{
    if(request.token === null || request.token === undefined){
      next()
    }
    const decodedToken = jwt.verify(request.token,process.env.SECRET)
    if(!decodedToken.id){
      return response.status(401).json({error: 'token invalid'})
    }
    const user = await User.findById(decodedToken.id)
    //const user = request.body.user
    request.user = user
    next()
  }

  module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
  }