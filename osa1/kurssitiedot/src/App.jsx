const Header = (props) =>{
  return <h1>{props.course}</h1>
}
const Content = (props) =>{
    return (<>
      <p>{props.parts[0]} {props.exercices[0]}</p>
      <p>{props.parts[1]} {props.exercices[1]}</p>
      <p>{props.parts[2]} {props.exercices[2]}</p>
    </>
    )
}

const Total = (props) =>{
  return (<p>Number of exercises: {props.counts.reduce((a,b) => a+b, 0)} </p>)
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course}/>
      <Content parts={[part1,part2,part3]} exercices={[exercises1,exercises2,exercises3]}/>
      <Total counts={[exercises1,exercises2,exercises3]}/>
    </div>
  )
}

export default App