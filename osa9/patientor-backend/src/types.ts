export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'windy' | 'stormy';

export type Visibility = 'great' | 'good' | 'ok' | 'poor';

export enum Gender{ Male= 'male', Female= 'female', Other= 'other'};

export type DiagnoseEntry = {
    code: string,
    name: string,
    latin?: string
};

export type PatientEntry = {
        id: string,
        name: string,
        dateOfBirth: string,
        ssn: string,
        gender: Gender,
        occupation: string
};

export type NonSensitivePatientEntry = Omit<PatientEntry, 'ssn'>;

export type NewPatientEntry = Omit<PatientEntry, 'id'>;
/* export interface DiagnoseEntry {
    id: number;
    date: string;
    weather: Weather;
    visibility: Visibility;
    comment: string;
  } */