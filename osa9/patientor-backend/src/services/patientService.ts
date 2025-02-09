import patientData from '../data/patients';
import { PatientEntry, NonSensitivePatientEntry, NewPatientEntry, Gender } from '../types';
import { v1 as uuid } from 'uuid';

const patients: PatientEntry[] = patientData.map(patient => ({
  ...patient,
  gender: patient.gender as Gender // Ensure gender is cast to Gender type
}));

const getEntries = (): PatientEntry[] => {
  return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {
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

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isString = (s: unknown): s is string => {
  return typeof s === 'string' || s instanceof String;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing command");
  }
  return date;
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error("Incorrect or missing command");
  }
  return name;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender).includes(param as Gender);
};

const parseGender = (g: unknown): Gender => {
  if (!g || !isString(g) || !isGender(g)) {
    throw new Error("Incorrect or missing command");
  }
  return g as Gender; // Cast to Gender
};

const parseOccupation = (o: unknown): string => {
  if (!o || !isString(o)) {
    throw new Error("Incorrect or missing command");
  }
  return o;
};

const parseSsn = (data: unknown): string => {
  if (!data || !isString(data)) {
    throw new Error("Incorrect or missing command");
  }
  return data;
};

const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }
  if ('name' in object && 'dateOfBirth' in object && 'gender' in object && 'occupation' in object && 'ssn' in object) {
    const newEntry: NewPatientEntry = {
      name: parseName(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      ssn: parseSsn(object.ssn)
    };
    return newEntry;
  }
  throw new Error('Incorrect data: some fields are missing');
};

const addPatient = (data: NewPatientEntry): PatientEntry => {
  const newEntry = toNewPatientEntry(data);
  const newPatient = {
    id: uuid(),
    ...newEntry
  };
  patients.push(newPatient);
  console.log(patients);
  return newPatient;
};


const getNonSensitiveById = (id:string): NonSensitivePatientEntry | undefined =>{
  const entries = getNonSensitiveEntries();
  const found = entries.find(p=>id===p.id);
  
  return found;
};

export default {
  getEntries,
  addPatient,
  getNonSensitiveEntries,
  getNonSensitiveById,
};
