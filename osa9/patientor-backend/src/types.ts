export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'windy' | 'stormy';

export type Visibility = 'great' | 'good' | 'ok' | 'poor';

export type Gender = 'male' | 'female' | 'other';

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

/* export interface DiagnoseEntry {
    id: number;
    date: string;
    weather: Weather;
    visibility: Visibility;
    comment: string;
  } */