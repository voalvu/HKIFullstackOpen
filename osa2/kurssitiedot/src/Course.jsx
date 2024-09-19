const Header = (props) =>{
    return <h1>{props.course.name}</h1>
  }
  const Content = ({parts}) =>{
    console.log(parts[0].exercises)
      return (<div>
          {parts.map(part => <Part part={part.name} exercises={part.exercises}/>)}
        </div>
      )
  }
  
  const Part = ({part,exercises}) =>{
    return <p>{part} {exercises}</p>
  }
  
  const Total = (props) =>{
    let total = 0
    for(let part of props.parts){
      total+=part.exercises
    }
  
    return (<p><b> total number of exercises: {total} </b></p>)
  }

const Course = ({course}) =>{
    return (
      <div>
        <Header course={course}/>
        <Content parts={course.parts}/>
        <Total parts={course.parts}/>
      </div>
    )
  }

export default Course