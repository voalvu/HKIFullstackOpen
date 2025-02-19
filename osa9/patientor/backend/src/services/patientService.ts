import patientData from '../data/patients-full';
import { Entry, Patient, NonSensitivePatient, Gender } from '../../../shared/types/types';
import { v1 as uuid } from 'uuid';
import {toNewPatient, toNewVisitEntry} from '../../../shared/utils';

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

const addPatient = (data: object): Patient => {
  const newEntry = toNewPatient(data);
  const newPatient = {
    id: uuid(),
    entries: [],
    ...newEntry
  };
  patients.push(newPatient);
  return newPatient;
};

// helper function to get YYYY-MM-DD format
const getCurrentDate = (): string => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};
const addEntry = (data: object, id: string): Patient => {
  console.log('at addEntry, handling:', data, "for id:", id);

  const patient = getById(id);
  if (!patient) {
    throw new Error("No patient with the given ID.");
  }

  const newEntry = toNewVisitEntry({ ...data, id: uuid(), date: getCurrentDate() });
  console.log('parsed to newEntry', newEntry);

  // Check if newEntry is an instance of Error
  if (newEntry instanceof Error) {
    console.error('Error parsing new entry:', newEntry.message);
    throw newEntry; // Throw the error instead of returning it
  }

  const newEntries: Entry[] = patient.entries ? patient.entries : [];
  newEntries.push(newEntry);
  const updatedPatient = { ...patient, entries: newEntries };
  const found = patients.find(p => p.id === updatedPatient.id);
  if (found) {
    const idx = patients.indexOf(found);
    patients[idx] = updatedPatient;
  }
  return updatedPatient;
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
