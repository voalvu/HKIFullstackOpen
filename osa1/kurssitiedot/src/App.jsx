const Header = (props) =>{
  return <h1>{props.course}</h1>
}
const Content = (props) =>{
    return (<div>
      <Part part={props.parts[0].name} exercices={props.parts[0].exercises}/>
      <Part part={props.parts[1].name} exercices={props.parts[1].exercises}/>
      <Part part={props.parts[2].name} exercices={props.parts[2].exercises}/>
      </div>
    )
}

const Part = (props) =>{
  return <p>{props.part} {props.exercices}</p>
}

const Total = (props) =>{
  return (<p>Number of exercises: {props.counts.reduce((a,b) => a+b, 0)} </p>)
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  return (
    <div>
      <Header course={course}/>
      <Content parts={[part1,part2,part3]}/>
      <Total counts={[part1.exercises,part3.exercises,part2.exercises]}/>
    </div>
  )
}

export default App