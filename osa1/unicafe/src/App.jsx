import { useState } from "react"

const Header = (props) =>{
  return <h1>Anna palautetta</h1>
}
const Button = (props) =>{
  
    return <button onClick={()=>{console.log('clikked',props.name);props.onClick(props.value+1)}}>{props.name}</button>//onClick={setValueKlikkaus(klikkaus+1)}
  //return <button onClick={setValueKlikkaus(klikkaus+1)}>{props.name}</button>
}

const Buttons = (props)=> {
  return (<div class="buttons">
    <Button name="hyvää" onClick={props.options["good"].onClick} value={props.options["good"].value} ></Button>
    <Button name="ok" onClick={props.options["neutral"].onClick} value={props.options["neutral"].value}></Button>
    <Button name="eh..." onClick={props.options["semi"].onClick} value={props.options["semi"].value}></Button>
    <Button name="pahaa >:(" onClick={props.options["bad"].onClick} value={props.options["bad"].value}></Button>
  </div>)
}

const Statistics =(props)=>{
return (<>
  <h1>Statistics</h1>
  <div class="statistics">
    <p>{Object.keys(props.options)[0]+": "}{props.options["good"].value}</p>
    <p>{Object.keys(props.options)[1]+": "}{props.options["neutral"].value}</p>
    <p>{Object.keys(props.options)[2]+": "}{props.options["semi"].value}</p>
    <p>{Object.keys(props.options)[3]+": "}{props.options["bad"].value}</p>
    </div>
</>)
}

/* const Klikkaukset = (props)=>{
  let j = 1
  for(let el of props.klikkaukset){
    <p>{el}</p>
    j+=1
  }
} */

const App = () => {

  // Learned that the state shouldn't be used inside smaller components in an App like this.
  // First I tried setting these inside the buttons but ran into trouble getting the value into the statistics component to render it. 
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [semi, setSemi] = useState(0)
  const [bad, setBad] = useState(0)

  const options = { 
    "good":{"value":good,"onClick":setGood},
    "neutral":{"value":neutral,"onClick":setNeutral},
    "semi":{"value":semi,"onClick":setSemi},
    "bad":{"value":bad,"onClick":setBad}
  }

  return (
    <div>
      <Header/>
      <Buttons options={options}></Buttons>
      <Statistics options={options}> neutral</Statistics>
      {/* <Klikkaukset klikkaukset={[klikkaus1,klikkaus2,klikkaus3,klikkaus4]}></Klikkaukset> */}
    </div>
  )
}

export default App