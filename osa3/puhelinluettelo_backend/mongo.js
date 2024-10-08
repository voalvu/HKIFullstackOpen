import mongoose from 'mongoose'

if(process.argv.length<3){
  console.log('give password as argument')
  process.exit(1)
}

const password=process.argv[2]

const url = `mongodb+srv://voalvu:${password}@cluster0.dsw23.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person',personSchema)


// Save person to Atlas from user input
if(process.argv.length>3){

  // Example person
  /* const person = new Person({
    name: "John Jones",
    number: "546456-3242"
}) */

  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else{

  // Return all people in phonebook
  Person.find({}).then(result => {
    result.forEach(note => {
      console.log(note.name, note.number)
    })
    mongoose.connection.close()
  })
}