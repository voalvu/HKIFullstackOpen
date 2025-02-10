import React, { JSX } from "react";
import PropTypes from "prop-types";

/**
 * Helper function for exhaustive type checking
 */
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const App = () => {
  const courseName = "Half Stack application development";
  interface CoursePartBase {
    name: string;
    exerciseCount: number;
  }
  
  interface CoursePartBasic extends CourtPartDescription {
    kind: "basic"
  }
  
  interface CoursePartGroup extends CoursePartBase {
    groupProjectCount: number;
    kind: "group"
  }
  
  interface CoursePartBackground extends CourtPartDescription {
    description: string;
    backgroundMaterial: string;
    kind: "background"
  }
  interface CourtPartDescription extends CoursePartBase {
    description: string;
    //kind: "description"
  }
  interface CoursePartRequirements extends CourtPartDescription {
    requirements: string[];
    kind: "special";
  }

  type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartRequirements;
  
  const Total = (props:TotalProps) => {
    const totalExercises = props.courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);
    return (
  <p>
    Number of exercises {totalExercises}
  </p>)}

  const Content = (props: ContentProps): JSX.Element => {
    return(
      <div>
        {props.courseParts.map(p=><Part coursePart={p}></Part>)}
      </div>
    )
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

  const Part = (props: PartProps): JSX.Element => {
    const { coursePart: part } = props;
    switch (part.kind) {
      case "background":
        return (
          <div>
            <h2>{part.name} {part.exerciseCount}</h2>
            <p><i>{part.description}</i></p>
            <p>submit to: {part.backgroundMaterial}</p>
          </div>
        );
      case "basic":
        return (
          <div>
            <h2>{part.name} {part.exerciseCount}</h2>
            <p><i>{part.description}</i></p>
          </div>
        );
      case "group":
        return (
          <div>
            <h2>{part.name} {part.exerciseCount}</h2>
            <p> group exercise count: {part.groupProjectCount}</p>
          </div>
        );
      case "special":
        return (
          <div>
            <h2>{part.name} {part.exerciseCount}</h2>
            <p><i>{part.description}</i></p>
            <p>Required skills: {part.requirements.map(r=><li>{r}</li>)}</p>
          </div>
        );
      default:
        return assertNever(part);
    }
  };

  interface PartProps {
    coursePart: CoursePart;
  }


  
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
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