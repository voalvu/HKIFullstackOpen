import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({setFil}) => {
    const handleFilterInput = (e) => {
        console.log(e.target.value)
        setFil(e.target.value)
      }
    return(<p>filter shown with <input onInput={handleFilterInput}/></p>)
}

const Persons = ({persons,filter}) =>{
    const personsToShow = persons.filter(per => per.name.toLowerCase().includes(filter.toLowerCase()))
    console.log(personsToShow)

    return(<><h2>Numbers</h2>
    {personsToShow.map((per,idx) => <p key={`${per.name.split(' ')[0]}-${idx}}`}>{per.name} {per.number}</p>)}
    </>
    )
}

const AddPersonForm = ({persons, setPersons}) =>{

    const handleClick = (e) =>{
        e.preventDefault()
        console.log(e.target)
        console.log(persons.map(per => per.name).includes(e.target[0].value))
        let inputName = e.target[0].value
        let inputNum = e.target[1].value
        
        if(persons.map(per => per.name.replaceAll(" ",'')).includes(inputName.replaceAll(" ",''))){
            alert(inputName + "already added in phonebook")
            return
        }
        let newPersons = [...persons]
        setPersons(newPersons.concat([{name:inputName, number:inputNum}]))
        //console.log(e.target[0].value)
    }

    return (<form onSubmit={handleClick}>
        <div>
          name: <input />
        </div>
        <div>number: <input /></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>)
}

const App = () => {
    const [notes, setNotes] = useState([])
    const [persons, setPersons] = useState([])
  const [fil, setFil] = useState('')

  
  useEffect(() => {
    console.log('notes effect')    
    axios      
      .get('http://localhost:3001/notes')      
      .then(response => {        
        console.log('promise fulfilled')        
        setNotes(response.data)      
      })  
    }, [])  
    console.log('render', notes.length, 'notes')

    useEffect(() => {
      console.log('persons effect')    
      axios      
        .get('http://localhost:3001/persons')      
        .then(response => {        
          console.log('promise fulfilled')        
          setPersons(response.data)      
        })  
      }, [])  
      console.log('render', persons.length, 'persons')

  return (
    <>
    <div>
      <h2>Phonebook</h2>
      <Filter setFil={setFil}/>
      <h2>Add new person to phonebook</h2>
      <AddPersonForm persons={persons} setPersons={setPersons}/>
      <Persons persons={persons} filter={fil}/>

      {/* {persons.filter(per => per.name.toLowerCase().includes(fil.toLowerCase())).map(per => <p>{per.name} {per.number}</p>)}/* .filter(entry => entry.innerText.toLowerCase()===fil)} */}    
      </div>
    </>
  )

}

export default App