import { useState, useEffect, JSX } from "react";
import { Button } from '@mui/material';
import axios from 'axios';

import { DiagnoseEntry, EntryFormValues, Patient } from '../../../../shared/types/types';
import AddEntryModal from "../AddEntryModal";

import patientService from "../../services/patients";

import { useParams } from 'react-router-dom';

import maleIcon from './icons/male-gender.png';
import femaleIcon from './icons/female-symbol.png';
import neutralGenderIcon from './icons/gender-neutral.png';

import Hospital from './HospitalEntry';
import Occupational from './OccupationalEntry';
import HealthCheck from './HealthCheckEntry';
import diagnoseService from "../../services/diagnoseService";
/**
 * Helper function for exhaustive type checking
 */
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const SinglePatientPage = (): JSX.Element | null => {
    const [patient, setPatient] = useState<Patient>();
    const { id } = useParams<{ id: string }>();
  
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [error, setError] = useState<string[]>([]);
  
    const [diagnoses,setDiagnoses] = useState<DiagnoseEntry[]>();
    
    const openModal = (): void => setModalOpen(true);
  
    const closeModal = (): void => {
      setModalOpen(false);
      setError([]);
    };
  
    useEffect(() => {
        if(id)
          patientService.getById(id).then(res => {
            setPatient(res as Patient);
          });
        if(!diagnoses)
          diagnoseService.getAll().then(res=>{
            setDiagnoses(res as DiagnoseEntry[]);
          });
    }, [id,diagnoses]);
    const handleErrors = (unionErrors:Zod.ZodError[]):string[] => {
      console.log(unionErrors);
      //console.log(typeof unionErrors)
      console.log(Object.values(unionErrors).map(e=>e.issues.map((issue:Zod.ZodIssue)=>`${issue.message}: ${issue.path.join('')}`)));
      return Object.values(unionErrors).map((e:Zod.ZodError)=>
        e.issues.map(
          (issue:Zod.ZodIssue)=>
            `${issue.message}: ${issue.path.join('')}`
        )
      ).values();
    };

    const submitNewVisitEntry = async (values: EntryFormValues) => {
      try {
        await patientService.createEntry(values, id).then(res=>{setPatient(res as Patient);});
        
        setModalOpen(false);
      } catch (e: unknown) {
        if(axios.isAxiosError(e)){
          console.log('axios error caught');
          console.log(e);
          const errorArray:string[] = [e.message];
          Object.values(e.response?.data.message.issues).map(error =>{
            console.log(error);
            switch(error.code){
              case "invalid_union":
                errorArray.concat(handleErrors(error.unionErrors)); //{"code":error.code,"unionErrors": handleErrors(error.unionErrors)};//.map(ue=>{return(JSON.stringify(ue))})}
                return;
              case "too_small":
                errorArray.push(`field ${error.path} can't be empty`);
                return;
              default: 
                errorArray.push(`${{"code":error.code, error:error}}`);
                return;
            }
          });
          console.log(errorArray);
          setError(errorArray);
          setTimeout(()=>{setError([]);},5000);

        }
      }
    };
  
  
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
              return <div id="entry-wrapper"> <Hospital
              entry={entry} 
              diagnoses={diagnoses} 
            ></Hospital> </div>;
            case 'HealthCheck':
              
              return <div id="entry-wrapper"> <HealthCheck  
              diagnoses={diagnoses}  entry={entry}></HealthCheck></div>;
            case 'OccupationalHealthcare':
              return <div id="entry-wrapper"> <Occupational 
              diagnoses={diagnoses}  entry={entry}></Occupational></div>;
            default: 
              return assertNever(entry);
            }
        })}
        </div> : null
      }
  
  <AddEntryModal
          modalOpen={modalOpen}
          onSubmit={submitNewVisitEntry}
          errors={error}
          onClose={closeModal}
          diagnoses={diagnoses}
    />

    <Button variant="contained" onClick={() => openModal()}>
        Add Entry
      </Button>
      </div>
    
     : "Loading..."}</>;
  };

  export default SinglePatientPage;
