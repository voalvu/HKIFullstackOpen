import { useState, useEffect } from 'react'
import axios from 'axios'
import weather_descriptions from './descriptions.json'



const CountryInfo = ({country}) =>{
  const [weatherObj, setWeatherObj] = useState({})
  const api_key = import.meta.env.VITE_WEATHER_API

  useEffect(()=>{
    if (country){
      //console.log(country)
      axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${country.capitalInfo.latlng[0]}&longitude=${country.capitalInfo.latlng[1]}&current=temperature_2m,wind_speed_10m,weather_code&wind_speed_unit=ms`)
        .then((res)=>{
          //console.log(res.data);
          setWeatherObj(res.data);
      })}
  }, [country])

  if (country == null)  return (<div></div>)
    //console.log(weatherObj)
  return (
  
    <div>
      <h1>{country.name.common}</h1>
      <br></br>
      capital {country.capital}
      <br></br> 
      area {country.area}
      
      <h3>languages</h3>
      <ul>
        <li>
          {Object.values(country.languages).map(lang=><li key={lang}>{lang}</li>)}
        </li>
      </ul>

      {<img src={country.flags.png}></img>}
      
      <h3>Weather in {country.capital}</h3>
      {/* The questionmarks help to render the component when the data hasn't been received yet from API */}
      {`${weatherObj.current?.temperature_2m} ${weatherObj.current_units?.temperature_2m}`}
      <br></br>
      
      {/* Weather codes mapped to Open weather map icons. Source in README.md */}
      {/* Perform check that both used variables have been set before rendering img */}
      {weatherObj.current?.weather_code && weather_descriptions[weatherObj.current.weather_code]
        ? <img src={weather_descriptions[weatherObj.current.weather_code].day.image}></img>
        : null}
      
      <br></br>
      {`${weatherObj.current?.wind_speed_10m} ${weatherObj.current_units?.wind_speed_10m}`}
    </div>
  )
}

const App = () => {

const [countries,setCountries] = useState([])
const [inputText,setInput] = useState("Finland")
const [foundCountries,setFoundCountries] = useState([])
const [singleCountry, setSingleCountry] = useState(null)


const handleInput =(e) =>
{
  setInput(e.target.value)
}

// get all countries on first page load

// ALSO
// Mock API key printed in console to demonstrate my understanding of Vite .env variables.

useEffect(() => {
  console.log("first page load effect")
    axios.get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((res)=>{setCountries(res.data); console.info(`MOCK API KEY USE, AS WE DIDN'T USE ONE FOR WEATHER DATA\n ${import.meta.env.VITE_SOME_KEY}`)})
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
      <CountryInfo country={singleCountry} weather_descriptions={weather_descriptions}></CountryInfo>
    </div>
    </>
  )

}

export default App