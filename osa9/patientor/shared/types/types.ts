import { z } from 'zod';
import {diagnoseEntrySchema, newEntrySchema, newVisitEntrySchema} from '../utils';
export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'windy' | 'stormy';

export type Visibility = 'great' | 'good' | 'ok' | 'poor';

export enum Gender{ Male= 'male', Female= 'female', Other= 'other'};

export type DiagnoseEntry = z.infer<typeof diagnoseEntrySchema>;

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;

export type NewPatient = z.infer<typeof newEntrySchema>; 

export type NewEntry = z.infer<typeof newVisitEntrySchema>;

// front end
export type PatientFormValues = Omit<Patient, "id" | "entries">;

export interface Patient extends NewPatient {
  id: string;
  entries?: Entry[]
}

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<DiagnoseEntry['code']>;
}

export enum HealthCheckRating {
  Healthy = 0,
  LowRisk = 1,
  HighRisk = 2,
  CriticalRisk = 3
}
export enum EntryTypeEnum{ 
  HealthCheck= 'Healthcheck', 
  Occupational= 'Occupational Healthcare', 
  Hospital= 'Hospital'
};


export interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}

export interface OccupationalHealthcareEntry extends BaseEntry{
  type: "OccupationalHealthcare",
  employerName: string,
  sickLeave?: {startDate: string,
    endDate: string
  }
} 

export interface HospitalEntry extends BaseEntry {
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





//export type EntryFormValues = Omit<Entry, "id">;

// Define special omit for unions
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
// Define Entry without the 'id' property
export type EntryFormValues = UnionOmit<Entry, 'id' | 'date'>;
//export type NewPatient = Omit<Patient, 'id'>;
/* export interface DiagnoseEntry {
    id: number;
    date: string;
    weather: Weather;
    visibility: Visibility;
    comment: string;
  } */


export 
interface Discharge {
  date: string,
  criteria?: string
}
export
interface SickLeave {
  startDate: string,
  endDate: string
}
export
interface TypeOption {
  value: string
}
export
interface RatingOption {
  value: string,
}