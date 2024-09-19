import { useState } from 'react'

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
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas', number: '040-123456' },
        { name: 'Ada Lovelace', number: '39-44-5323523' },
        { name: 'Dan Abramov', number: '12-43-234345' },
        { name: 'Mary Poppendieck', number: '39-23-6423122' }
      ])
  const [fil, setFil] = useState('')

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