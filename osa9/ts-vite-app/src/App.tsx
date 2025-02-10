import React, { JSX } from "react";
import PropTypes from "prop-types";


const Total = (props:TotalProps) => {
  const totalExercises = props.courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);
  return (
<p>
  Number of exercises {totalExercises}
</p>)}

type CoursePart = {
  name:string
  exerciseCount:number
} 
const Content = (props: ContentProps): JSX.Element => {
  return(
  <div>
  <p>
    {props.courseParts[0].name} {props.courseParts[0].exerciseCount}
  </p>
  <p>
    {props.courseParts[1].name} {props.courseParts[1].exerciseCount}
  </p>
  <p>
    {props.courseParts[2].name} {props.courseParts[2].exerciseCount}
  </p>

</div>)
}

interface HeaderProps {
  title: string;
}

interface ContentProps {
  courseParts: CoursePart[];
}

interface TotalProps {
  courseParts: CoursePart[];
}

const Header = (props:HeaderProps):JSX.Element =>{
  return(<h1>{props.title}</h1>)
}

Header.propTypes = {
  name: PropTypes.string
};

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts = [
    {
      name: "Fundamentals",
      exerciseCount: 10
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14
    }
  ];

  return (
    <div>
      <Header title={courseName}></Header>
      <Content courseParts={courseParts}></Content>
      <Total courseParts={courseParts}></Total>
    </div>
  );
};

export default App;