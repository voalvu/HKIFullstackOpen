import patientData from '../data/patients-full';
import { Entry, Patient, NonSensitivePatient, Gender } from '../types';
import { v1 as uuid } from 'uuid';
import {toNewPatient, toNewVisitEntry} from '../utils';

const patients: Patient[] = patientData.map(patient => ({
  ...patient,
  gender: patient.gender as Gender // Ensure gender is cast to Gender type
}));

const getEntries = (): Patient[] => {
  return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => (
    {
      id,
      name,
      dateOfBirth,
      gender,
      occupation
    }
  ));
};

/* const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
}; */

/* const isString = (s: unknown): s is string => {
  return typeof s === 'string' || s instanceof String;
}; */



/* const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }
  if ('name' in object && 'dateOfBirth' in object && 'gender' in object && 'occupation' in object && 'ssn' in object) {
    const newEntry: NewPatient = {
      name: parseName(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      ssn: parseSsn(object.ssn)
    };
    
    return newEntry;
  }
  throw new Error('Incorrect data: some fields are missing');
}; */

const addPatient = (data: object): Patient => {
  const newEntry = toNewPatient(data);
  const newPatient = {
    id: uuid(),
    entries: [],
    ...newEntry
  };
  patients.push(newPatient);
  //console.log(patients);
  return newPatient;
};
const getCurrentDate = (): string => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};
const addEntry = (data: object, id:string): Patient | undefined => {
  console.log('at addEntry, handling:',data,"for id:",id)
  const newEntry = toNewVisitEntry({...data, id:uuid(), date: getCurrentDate()});
  console.log('parsed to newEntry',newEntry)
  const patient = getById(id);
  if(patient){
    let newEntries: Entry[];
    if(patient.entries !== undefined){
      newEntries = patient.entries;
    }else{
      newEntries = [];
    }
    newEntries.push(newEntry);
    const updatedPatient = {...patient, entries:newEntries};
    const found = patients.find(p=>p.id===updatedPatient.id);
    let idx;
    if(found){idx=patients.indexOf(found);
       patients[idx] = updatedPatient;
    }
    
    //patients.map((p)=>{p.id === id ? updatedPatient : p});
    //console.log(patients);
    return updatedPatient;
  }else{return;};

};

const getById = (id:string): Patient | undefined =>{
  const entries = getEntries();
  const found = entries.find(p=>id===p.id);
  
  return found;
};

const getNonSensitiveById = (id:string): NonSensitivePatient | undefined =>{
  const entries = getNonSensitiveEntries();
  const found = entries.find(p=>id===p.id);
  
  return found;
};

export default {
  getEntries,
  addPatient,
  addEntry,
  getNonSensitiveEntries,
  getNonSensitiveById,
  getById,
};
