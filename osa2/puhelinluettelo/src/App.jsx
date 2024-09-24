import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Filter = ({setFil}) => {
    const handleFilterInput = (e) => {
        console.log(e.target.value)
        setFil(e.target.value)
      }
    return(<p>filter shown with <input onInput={handleFilterInput}/></p>)
}

const Persons = ({persons,filter,setPersons}) =>{
    const personsToShow = persons.filter(per => per.name.toLowerCase().includes(filter.toLowerCase()))
    console.log(personsToShow)

    const handlePersonRemoval = (e, per) => {
      console.log(e);
      if (window.confirm(`delete ${per.name}`)) {
        console.log(`deleting ${per.name} with id ${per.id}`)
        personService.getById(per.id)
        .then((res)=>console.log(res))
        personService
          .deletePerson(per.id)
          .then((response) => {
            console.log("person removed", response);
            setPersons(persons.filter((p) => p.id !== per.id));
          })
          .catch((error) => {
            console.error("Error deleting person:", error);
            console.log("Server response:", error.response);
            alert(`Error deleting ${per.name}: ${error.message}`);
          });
        console.log("removing complete");
      }
    };
    
    return(<><h2>Numbers</h2>
    {personsToShow.map((per,idx) => <><p key={`${per.name.split(' ')[0]}-${idx}}`}>{per.name} {per.number}<button onClick={(e) => handlePersonRemoval(e,per)}>delete</button></p></>)}
    </>
    )
}

const AddPersonForm = ({persons, setPersons}) =>{

    const handleAddingPerson = (e) =>{
        e.preventDefault()
        let inputName = e.target[0].value
        let inputNum = e.target[1].value
        
        if(persons.map(per => per.name.replaceAll(" ",'')).includes(inputName.replaceAll(" ",''))){
            alert(inputName + "already added in phonebook")
            return
        }
        let newPersons = [...persons]

        const getId = () => {return Math.floor(Math.random() * 100000).toString()}
        personService
          .create({name:inputName, number:inputNum, id:getId()})
        //axios.post('http://localhost:3001/persons', {name:inputName, number:inputNum})
          .then(res => {//console.log(res)
          setPersons(newPersons.concat([res.data]))}
        )
        
        
        //console.log(e.target[0].value)
    }

    return (<form onSubmit={handleAddingPerson}>
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
  //const [notes, setNotes] = useState([])
  const [persons, setPersons] = useState([])
  const [fil, setFil] = useState('')

  // This code displays persons by calling setPerson with data from personService getAll route(?) 
  useEffect(() => {
    console.log('persons getAll effect')
    personService.getAll()    
      .then(response => {        
        console.log('persons getAll promise fulfilled')        
        setPersons(response.data)      
      })}
, [])
      console.log('render',persons.length,'persons')

      console.log(
      personService
        .getById(78))

/* personService.deletePerson()    
.then(response => {        
  console.log('persons deletePerson promise fulfilled')        
  setPersons(response.data)      
})  

} */
  return (
    <>
    <div>
      <h2>Phonebook</h2>
      <Filter setFil={setFil}/>
      <h2>Add new person to phonebook</h2>
      <AddPersonForm persons={persons} setPersons={setPersons}/>
      <Persons persons={persons} filter={fil} setPersons={setPersons}/>

      {/* {persons.filter(per => per.name.toLowerCase().includes(fil.toLowerCase())).map(per => <p>{per.name} {per.number}</p>)}/* .filter(entry => entry.innerText.toLowerCase()===fil)} */}    
      </div>
    </>
  )

}

export default App