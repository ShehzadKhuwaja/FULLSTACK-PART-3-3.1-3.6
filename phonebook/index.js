const express = require('express')
var morgan = require('morgan')
const app = express()

let phonebookEntries = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(phonebookEntries)
})

app.get('/info', (request, response) => {
    response.send(`<div><p>Phonebook has info for ${phonebookEntries.length} people</p><p>${new Date()}</p><div/>`)
})

app.get('/api/persons/:id', (request, response) => {
    const person = phonebookEntries.find(person => person.id === Number(request.params.id))

    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    phonebookEntries = phonebookEntries.filter(person => person.id !== Number(request.params.id))

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "name or number is missing"
        })
    }
    
    const oldEntry = phonebookEntries.find(person => person.name === body.name)
    if (oldEntry) {
        return response.status(400).json({
            error: "name must be unique"
        })
    } 

    const newEntry = {
        "id": Math.floor(Math.random() * 1000000000000000),
        "name": body.name,
        "number": body.number
    }

    phonebookEntries = phonebookEntries.concat(newEntry)

    response.json(newEntry)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})