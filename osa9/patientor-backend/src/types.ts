import { z } from 'zod';
import {newEntrySchema} from './utils';
export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'windy' | 'stormy';

export type Visibility = 'great' | 'good' | 'ok' | 'poor';

export enum Gender{ Male= 'male', Female= 'female', Other= 'other'};

export type DiagnoseEntry = {
    code: string,
    name: string,
    latin?: string
};

/* export type Patient = {
        id: string,
        name: string,
        dateOfBirth: string,
        ssn: string,
        gender: Gender,
        occupation: string
}; */


/* export interface Patient {
  id: string;
  name: string;
  ssn: string;
  occupation: string;
  gender: Gender;
  dateOfBirth: string;
  entries: Patient[]
} */

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;

export type NewPatient = z.infer<typeof newEntrySchema>; 

export interface Patient extends NewPatient {
  id: string;
  entries?: Entry[]
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}


interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}

interface OccupationalHealthcareEntry extends BaseEntry{
  type: "OccupationalHealthcare",
  employerName: string,
  sickLeave?: {startDate: string,
    endDate: string
  }
} 

interface HospitalEntry extends BaseEntry {
  type: 'Hospital',
  discharge: {
    date: string,
    criteria?: string,
  },
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

// Define special omit for unions
//type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
// Define Entry without the 'id' property
//type EntryWithoutId = UnionOmit<Entry, 'id'>;


interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;

  diagnosisCodes?: Array<DiagnoseEntry['code']>;
}
//export type NewPatient = Omit<Patient, 'id'>;
/* export interface DiagnoseEntry {
    id: number;
    date: string;
    weather: Weather;
    visibility: Visibility;
    comment: string;
  } */