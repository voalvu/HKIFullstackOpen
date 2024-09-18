import { useState } from "react"

const Header = (props) =>{
  return <h1>Anna palautetta</h1>
}
const Button = (props) =>{
  
    return <button onClick={()=>{console.log('clikked',props.name);props.onClick(props.value+1)}}>{props.name}</button>//onClick={setValueKlikkaus(klikkaus+1)}
  //return <button onClick={setValueKlikkaus(klikkaus+1)}>{props.name}</button>
}

const Buttons = (props)=> {
  return (    <div className="buttons">
    {Object.keys(props.options).map(key => (
      <Button key={key} name={key} onClick={props.options[key].onClick} value={props.options[key].value} />
    ))}
  </div>)
}

const Statistics =(props)=>{
return (<>
  <h1>Statistics</h1>
  <div className="statistics">
        {Object.keys(props.options).map(key => (
          <p key={key}>{key}: {props.options[key].value}</p>
        ))}
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
  const [feedback, setFeedback] = useState({
    good: 0,
    neutral: 0,
    semi: 0,
    bad: 0,
  });

  const handleFeedback = (type) => {
    setFeedback(prev => ({ ...prev, [type]: prev[type] + 1 }));
  };

  const options = {
    good: { value: feedback.good, onClick: () => handleFeedback('good') },
    neutral: { value: feedback.neutral, onClick: () => handleFeedback('neutral') },
    semi: { value: feedback.semi, onClick: () => handleFeedback('semi') },
    bad: { value: feedback.bad, onClick: () => handleFeedback('bad') },
  };

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