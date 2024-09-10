const http = require('http')
const express = require('express')
const { generateKey } = require('crypto')
const path = require('path')

let notes = [
    {
      id: "1",
      content: "HTML is easy",
      important: true
    },
    {
      id: "2",
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: "3",
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]

/*   const app = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(notes))
  }) */

app = express()
app.use(express.json())


// Serve static files from the 'src' directory
app.use(express.static(path.join(__dirname)));


app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname, 'html_file.html'));
  //res.sendFile('C:/Users/mina/Desktop/HKIFullstackOpen/osa3/src/html_file.html');  
  //res.send("<h1>Html hello2</h1><a href='/api/notes'>Notes</a> <a href='/api/notes/6'>Notes3</a>")
})

app.get('/api/notes',(req,res)=>
{   
    res.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const note = notes.find(note => note.id === id)
    if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
  })
    
  //calculate highest currently existing note id number, return +1
  const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
  }

app.post('/api/notes',(req,res)=>{

    const body = req.body
    if (!body.content) {
        return res.status(400).json({ 
          error: 'content missing' 
        })
      }

    const note = {
        content:body.content,
        important:body.important || false,
        id: generateId(),
    }
    notes = notes.concat(note)
    console.log(note)
    res.json(note)
})

let persons = [{id:"1",name:"first last",number:"123-123123"},
    {id:"2",name:"firsto lasto",number:"133-123123"},
    {id:"4",name:"firstadsf lastewr",number:"312-123123"},
    {id:"6",name:"John Finalos",number:"666-1453123"}
]

app.get('/api/persons',(req,res)=>
    res.json(persons))

app.get('/api/info',(req,res)=>{
    if(persons.length != 1)
        res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date().toString()}</p>`)
    else{
        res.send(`<p>Phonebook has info for 1 person</p> <p>${new Date().toString()}</p>`)
    }
}
)

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
  })

  app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter(person => person.id !== id)
  
    res.status(204).end()
  })

  const generatePhoneId = () => {
    const id = Math.floor(Math.random()*1000000)
    console.log(id)
    return String(id)
  }

  app.post('/api/persons',(req,res)=>{

    const body = req.body
    if (!body.name && !body.number) {
        return res.status(400).json({ 
          error: 'name and number missing' 
        })
      }
    else if(!body.name){
        return res.status(400).json({ 
            error: 'name missing' 
          })
    }else if(!body.number){
        return res.status(400).json({ 
            error: 'number missing' 
          })
    }else if(persons.find(person => person.name === body.name)){
        return res.status(400).json({ 
            error: 'name must be unique' 
          })
    }

    const person = {
        name:body.name,
        number:body.number,
        id: generatePhoneId(),
    }
    persons = persons.concat(person)
    console.log(person)
    res.json(person)
})

const PORT = 3001
app.listen(PORT, ()=>{console.log(`Server running on port ${PORT}`)})
