import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)
  const [countries, setCountries] = useState([])
  useEffect(() => {
    if(countries.length==0)
    fetch(`https://studies.cs.helsinki.fi/restcountries/api/all`).then((res)=>res.json()).then((data)=>{
      console.log(data);
      console.log((data.map(c=>c.name.common)))
      setCountries(data.map(c=>c.name.common.toLowerCase()))
    })
  },[countries])

  useEffect(() => {
    console.log(name);
    if(countries.length>0)
    if (countries.includes(name.toLowerCase())) {
      fetch(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.status !== 404) {
            setCountry({data:{name:data.name.common, capital:data.capital[0], population:data.population, 
              flag:data.flags.png}, found:true})
          } else {
            setCountry(null)
          }
        })
        .catch((error) => {
          console.error('Error fetching country data:', error)
          setCountry(null)
        })
    }
    else{
      setCountry({found:false})
    }
  }, [name])

  return country
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }
  //console.log(country)

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.data.name} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div> 
      <img src={country.data.flag} height='100' alt={`flag of ${country.data.name}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App