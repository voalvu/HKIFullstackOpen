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

const Persons = ({persons,filter,setPersons,setErrorMessage,setSuccessMessage}) =>{
  console.log(typeof(persons),persons)
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
            setSuccessMessage(`Person ${response.data.name} deleted`)
            setTimeout(() => {setSuccessMessage(null)}, 5000)
          })
          .catch((error) => {
            setErrorMessage(`Error deleting person ${per.name}. ${error.response.data}`)
            setTimeout(() => {setErrorMessage(null)}, 5000)
            console.log("Server response:", error.response);
          });
        console.log("removing complete");
      }
    };

    
    return(<><h2>Numbers</h2>
    {personsToShow.map((per,idx) => <><p key={`${per.name.split(' ')[0]}-${idx}}`}>{per.name} {per.number}<button onClick={(e) => handlePersonRemoval(e,per)}>delete</button></p></>)}
    </>
    )
}

const AddPersonForm = ({persons, setPersons, setSuccessMessage, setErrorMessage}) =>{

  const handleNumberUpdate = (per, num) => {
    console.log(per,per.id,num);
    if (window.confirm(`${per.name} already in phonebook, replace old number with new one?`)) {
      console.log(`updating ${per.name} (id ${per.id}) number with new num`)
      
      let updatedPerson = { ...per };
      updatedPerson.number = num;

      personService
        .update(per.id, updatedPerson)
        .then((response) => {
          console.log("number updated", response);
          let newPersons = [...persons]
          let idxToUpdate = newPersons.findIndex(p => p.id == per.id)
          newPersons[idxToUpdate] = response.data
          setPersons(newPersons);
          setSuccessMessage(`Person '${updatedPerson.name}' updated succesfully`)
          setTimeout(() => {setSuccessMessage(null)}, 5000)
        })
        .catch((error) => {
          console.error("Error updating number:", error);
          console.log("Server response:", error.response);
          setErrorMessage(`Can't update person '${updatedPerson.name}'. Person may have been removed from server`)
          setTimeout(() => {setErrorMessage(null)}, 5000)
        });
      console.log("number update complete");
    }
  };

    const handleAddingPerson = (e) =>{
        e.preventDefault()
        let inputName = e.target[0].value
        let inputNum = e.target[1].value
        
        const nameAlreadyExists = 
          persons.map(per => per.name.replaceAll(" ",'')).includes(inputName.replaceAll(' ',""))
        
        const found = Array.from(persons).find(per => per.name.replaceAll(" ",'').includes(inputName.replaceAll(' ',"")))
        if(nameAlreadyExists){
            if(found.number !== inputNum){
              handleNumberUpdate(found,inputNum)}
              else{
            alert(inputName + "already added in phonebook")
              }
            return
        }
        let newPersons = [...persons]

        const getId = () => {return Math.floor(Math.random() * 100000).toString()}
        personService
          .create({name:inputName, number:inputNum, id:getId()})
        //axios.post('http://localhost:3001/persons', {name:inputName, number:inputNum})
          .then(res => {//console.log(res)
          setPersons(newPersons.concat([res.data]))
            
          // Make succesfull add visual notification
          setSuccessMessage(`Added ${res.data.name}`)
          setTimeout(function () {
            setSuccessMessage(null)
        }, 3000);}
          
          
          
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

const Notification = ({ errorMessage, successMessage }) => {
  if (errorMessage === null && successMessage=== null) {
    return null
  }
  if(errorMessage !== null)
  return (
    <div className="error">
      {errorMessage}
    </div>
  )
  return (
    <div className="success">
      {successMessage}
    </div>
  )
}

const App = () => {
  //const [notes, setNotes] = useState([])
  const [persons, setPersons] = useState([])
  const [fil, setFil] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

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


  return (
    <>
    <div>
      <h2>Phonebook</h2>
      <Notification successMessage={successMessage} errorMessage={errorMessage}/>
      <Filter setFil={setFil}/>
      <h2>Add new person to phonebook</h2>
      <AddPersonForm persons={persons} setPersons={setPersons} setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage}/>
      <Persons persons={persons} filter={fil} setPersons={setPersons} setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>

      {/* {persons.filter(per => per.name.toLowerCase().includes(fil.toLowerCase())).map(per => <p>{per.name} {per.number}</p>)}/* .filter(entry => entry.innerText.toLowerCase()===fil)} */}    
      </div>
    </>
  )

}

export default App