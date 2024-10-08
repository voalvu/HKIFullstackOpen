import express from 'express'
import path from 'path'
import cors from 'cors'
import Person from './models/person.js'

//3.7
import morgan from 'morgan'

/* morgan("default",':method :url :status :res[content-length] - :response-time ms')
 */
/* morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}) */


const app = express()
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))//':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())
app.use(cors())

morgan.token('body', function getId (req) {
  const body = req.body
  const person = {
    name:body.name,
    number:body.number,
    //id: generatePhoneId(),
  }
  return JSON.stringify(person)
})


// Serve static files from the 'src' directory
//app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join('dist')))


const errorHandler = (error, request, response, next) => {

  if (error.statusCode === 400 && error.name === 'missingField') {
    //console.log("Hey this middleware is actually doing something")
    return response.status(error.statusCode).send({ error: error.message })
  }

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    //console.log(error.message)
    return response.status(400).send({ error: error.message })
  }
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/api/persons',(req,res,next) => {
  Person.find({}).then(result => {
    res.json(result)
  })
    .catch(error => next(error))
})

app.get('/info',(req,res) => {
  //Ignoring entries without a name field
  Person.find({}).then(result => {
    //console.log(result)
    const withNames = result.filter(per => {console.log(per.name); if(per.name){return per}else{return}})
    if(withNames.length !== 1)
      res.send(`<p>Phonebook has info for ${withNames.length} people</p><p>${new Date().toString()}</p>`)
    else{
      res.send(`<p>Phonebook has info for 1 person</p> <p>${new Date().toString()}</p>`)
    }
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (!person) {
        return res.status(404).send({ error: 'person not found' })
      }
      res.json(person)
    })
    .catch(error => {
      next(error)
    })
})


app.delete('/api/persons/:id', (req, res,next) => {
  Person.findByIdAndDelete(req.params.id).then(res => console.log(res))
    .catch(error => next(error))
  res.status(204).end()

})

app.post('/api/persons',(req,res, next) => {

  const body = req.body
  if (!body.name && !body.number) {
    const err = new Error('name and number missing')
    err.name = 'missingField'
    err.statusCode = 400
    next(err)
  }
  else if(!body.name){
    const err = new Error('name missing')
    err.name = 'missingField'
    err.statusCode = 400
    next(err)
  }
  else if(!body.number){
    const err = new Error('number missing')
    err.name = 'missingField'
    err.statusCode = 400
    next(err)
  }
  else{
    const person = new Person({
      name: body.name,
      number: body.number
    })
    /*     const person = {
        name:body.name,
        number:body.number,
        id: generatePhoneId(),
    } */
    person.save().then(savedPerson => {
      res.json(savedPerson)
    }).catch(error => next(error))
  }
}
)

app.put('/api/persons/:id',(req,res,next) => {
  const { name, number } = req.body
  /*   const person = body */
  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then( updatedPerson =>
      res.json(updatedPerson)
    )
    .catch(
      error => next(error)
    )
/*   persons[persons.indexOf(persons.find(per => per.id == req.body.id))] = req.body
   */
})

app.use(unknownEndpoint)

app.use(errorHandler)

const port = process.env.PORT || 3000
app.listen(port, () => {console.log(`Server running on port ${port}`)})
