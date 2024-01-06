require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const PhoneBookEntry = require('./models/phonebookEntry')

const app = express()

morgan.token('body', (req) => JSON.stringify(req.body))


app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    PhoneBookEntry.find({}).then(result => {
        response.json(result)
    })
})

app.get('/info', (request, response) => {
    PhoneBookEntry.find({}).then(result => {
        response.send(`<div><p>Phonebook has info for ${result.length} people</p><p>${new Date()}</p><div/>`)
    })
    
})

app.get('/api/persons/:id', (request, response, next) => {

    PhoneBookEntry.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        }
        else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {

    PhoneBookEntry.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const newEntry = new PhoneBookEntry({
        name: body.name,
        number: body.number
    })

    newEntry.save().then(savedEntry => {
        response.json(savedEntry)
    })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body

    PhoneBookEntry.findByIdAndUpdate(request.params.id, {name, number}, {new: true, runValidators: true, context: 'query'})
    .then(updatedEntry => {
        response.json(updatedEntry)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})