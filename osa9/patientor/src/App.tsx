import { useState, useEffect, JSX } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Button, Divider, Container, Typography } from '@mui/material';

import { HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry, Patient, DiagnoseEntry } from "../../patientor-backend/src/types";

import { useParams } from 'react-router-dom';

import maleIcon from '../public/male-gender.png';
import femaleIcon from '../public/female-symbol.png';
import neutralGenderIcon from '../public/gender-neutral.png';

import patientService from "./services/patients";
import diagnoseService from "./services/diagnoseService";
import PatientListPage from "./components/PatientListPage";

/**
 * Helper function for exhaustive type checking
 */
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const DiagnosesList = ({codes}:{codes:string[]}) => {
  const [diagnoses,setDiagnoses] = useState<DiagnoseEntry[]>([])
  
  useEffect(()=>{
    diagnoseService.getAll().then(res=>{setDiagnoses(res as DiagnoseEntry[])})
  },[]);

  return(codes.map(code=>{
      const diagnosis = diagnoses.find(d => d.code === code);
      return diagnosis ? (
      <li key={diagnosis.code}>
        <b>{diagnosis.code}</b>: {diagnosis.name} {diagnosis.latin ? <i>{`(${diagnosis.latin})`}</i> : '' }</li>
        ) : null;
      }
    )
  );
};

const Hospital = ({entry}:{entry: HospitalEntry}):JSX.Element | null => {
  return(<>
    {entry.date} {entry.description} 
    <ul>
      {entry.diagnosisCodes ? 
            <DiagnosesList codes={entry.diagnosisCodes}></DiagnosesList>
      :null}

          </ul>
    </>
  );
};

const HealthCheck = ({entry}:{entry: HealthCheckEntry}):JSX.Element | null => {
  return(<>{entry.date} {entry.description} Rating: {entry.healthCheckRating}     <ul>
    {entry.diagnosisCodes ? 
                  <DiagnosesList codes={entry.diagnosisCodes}></DiagnosesList>
                  : null}
        </ul></>
      );
};

const Occupational = ({entry}:{entry: OccupationalHealthcareEntry}):JSX.Element | null => {
  return(<>{entry.date} {entry.description} <ul>{entry.diagnosisCodes ?<DiagnosesList codes={entry.diagnosisCodes}></DiagnosesList>
:null    }</ul></>);
};

const SinglePatient = (): JSX.Element | null => {
  const [patient, setPatient] = useState<Patient>();
  const { id } = useParams<{ id: string }>();
/*   const [diagnoses, setDiagnoses] = useState<DiagnoseEntry[]>([]);
 */  useEffect(() => {
    if (id) {
      patientService.getById(id).then(res => {
        setPatient(res as Patient);
      });
    }
/*       diagnoseService.getAll().then(res=>{
        setDiagnoses(res as DiagnoseEntry[]);
      }); */
  }, [id]);

  return <>{patient !== undefined ? 
  <div>
    <p>{patient.name}</p>   
    <img alt={patient.gender} src={patient.gender === 'male' ? maleIcon : patient.gender === 'female' ? femaleIcon : neutralGenderIcon }></img>
    <p>ssn: {patient.ssn}</p>
    <p>occupation: {patient.occupation}</p>
    {patient.entries ?
      <div> <h3>Entries</h3>
      {patient.entries.map((entry)=>{
        switch(entry.type){
          case 'Hospital':
            return <Hospital entry={entry}></Hospital>;
          case 'HealthCheck':
            return <HealthCheck entry={entry}></HealthCheck>;
          case 'OccupationalHealthcare':
            return <Occupational entry={entry}></Occupational>;
          default: 
            return assertNever(entry);
          }
      })}
      </div> : null
    }
    </div>
  
   : "Loading..."}</>;
};

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
     patientService.getAll().then(res => (setPatients(res as Patient[])));
  }, []);
  
  return (
    <div className="App">
      <Router>
        <Container>
          <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Button component={Link} to="/patients" variant="contained" color="primary">
            Patients
          </Button>
          <Divider hidden />
          <Routes>
            <Route path="/" element={<PatientListPage patients={patients} setPatients={setPatients} />} />
            <Route path="/patients" element={<PatientListPage patients={patients} setPatients={setPatients} />} />
            <Route path="/patients/:id" element={<SinglePatient/>} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
