import patientData from '../data/patients-full';
import { Patient, NonSensitivePatient, Gender } from '../types';
import { v1 as uuid } from 'uuid';
import {toNewPatient} from '../utils';


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
  getNonSensitiveEntries,
  getNonSensitiveById,
  getById,
};
