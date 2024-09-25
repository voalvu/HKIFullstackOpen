import { useState, useEffect } from 'react'
import axios from 'axios'


const CountryInfo = ({country}) =>{
  if (country == null)  return (<div></div>)
  else return (
  <div>
    <h1>{country.name.common}</h1>
    <br></br>
    capital {country.capital}
    <br></br> 
    area {country.area}
    <h3>languages</h3>
    <ul>
      <li>
        {Object.values(country.languages).map(lang=><li>{lang}</li>)}
      </li>
    </ul>
    {<img src={country.flags.png}></img>}
    </div>
  ) 
}

const App = () => {

const [countries,setCountries] = useState([])
const [inputText,setInput] = useState("Finland")
const [foundCountries,setFoundCountries] = useState([])
const [singleCountry, setSingleCountry] = useState(null)


/* axios.get("https://studies.cs.helsinki.fi/restcountries/api/all")
  .then((res)=>console.log(res.data)) */
//console.log(inputText)

const handleInput =(e) =>
{
  setInput(e.target.value)

}


// get all countries
useEffect(() => {
  console.log("effect")
    axios.get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((res)=>setCountries(res.data))
},[])

// update foundCountries list whenever inputText changes. 
useEffect(() => {
  const country_names = countries.map(c => c.name.common.toLowerCase());
  let found = country_names.filter(cn => cn.includes(inputText.toLowerCase()));
  if (found.length < 10) {
    if (found.length > 0) {
      if(found.length == 1){
        axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${found[0]}`)
          .then((res)=>setSingleCountry(res.data))
          
        }
      // the use of find + map helps put normal case names of countries into the foundCountries list (instead of lowercased)) 
      setFoundCountries(found.map(c => countries.find(country => country.name.common.toLowerCase() === c).name.common));
    } else {
      setFoundCountries(['No results']);
    }
  } else {
    setFoundCountries(['Too many results']);
  }
}, [inputText]);

  return (
    <>
    <div>
      find countries <input type="text" onInput={handleInput}></input>
      <div></div>
      <p>Found:</p> {foundCountries.map(c => <p>{c}</p>)}
      <CountryInfo country={singleCountry}></CountryInfo>
    </div>
    </>
  )

}

export default App