import { useState } from "react"

const Header = (props) =>{
  return <h1>Anna palautetta</h1>
}
const Button = (props) =>{
  
    return <button onClick={()=>{console.log('clikked',props.name);props.onClick(props.value+1)}}>{props.name}</button>//onClick={setValueKlikkaus(klikkaus+1)}
  //return <button onClick={setValueKlikkaus(klikkaus+1)}>{props.name}</button>
}

const Buttons = (props)=> {
  return (<div className="buttons">
    <Button name="hyvää" onClick={props.options["good"].onClick} value={props.options["good"].value} ></Button>
    <Button name="ok" onClick={props.options["neutral"].onClick} value={props.options["neutral"].value}></Button>
    <Button name="eh..." onClick={props.options["semi"].onClick} value={props.options["semi"].value}></Button>
    <Button name="pahaa >:(" onClick={props.options["bad"].onClick} value={props.options["bad"].value}></Button>
  </div>)
}

const StatisticLine = (props) =>{
  return(
    <><td>{props.text+": "}</td><td>{props.value}</td></>
  )
}

const Statistics =(props)=>{
  let sum = 0
  let avg = 0
  let positive = 0

  // Checking if sum of feedback button pressed is total 0, using a combination of Object.map and Array.reduce().
  if(Object.values(props.options).map(val=>val.value).reduce((a,b) => {return a + b},0) == 0){
    return (<><h1>Statistics</h1>
    <p> No feedback yet </p></>)
  }else{
    return (<>
      <h1>Statistics</h1>
      <div className="statistics">
        <table>
            <tr>

        <StatisticLine text="good" value={props.options.good.value} />
        </tr><tr>
        <StatisticLine text="neutral" value ={props.options.semi.value} />
        </tr><tr>
        <StatisticLine text="semi" value={props.options.semi.value} />
        </tr><tr>
        <StatisticLine text="bad" value ={props.options.bad.value} />
        </tr><tr>

        {Object.keys(props.options).forEach(key => sum+=props.options[key].value)}

        <StatisticLine text="All" value ={sum} />
        </tr><tr>
        <StatisticLine text="Avg" value ={sum/Object.keys(props.options).length} /></tr><tr>
        <StatisticLine text="Positive" value ={props.options["good"].value/sum + "%"} /></tr>
        </table>
        </div>
        
    </>)
  }
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