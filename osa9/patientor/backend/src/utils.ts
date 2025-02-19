import { z } from 'zod';
import { NewPatient, Gender, NewEntry, HealthCheckRating } from './types';

const nonEmptyString = z.string().min(1, "field cannot be empty");

// Base schema for common properties
const baseEntrySchema = z.object({
  id: z.string(),
  description: nonEmptyString,
  date: nonEmptyString,
  specialist: nonEmptyString,
  diagnosticCodes: z.array(z.string()).optional(), // Assuming diagnosisCodes are strings
});

// Function to create specific entry schemas
const createEntrySchema = (type: string) => {

  switch (type) {
    case 'HealthCheck':
      return baseEntrySchema.extend({
        type: z.literal('HealthCheck'),
        healthCheckRating: z.nativeEnum(HealthCheckRating),
      });
    case 'OccupationalHealthcare':
      return baseEntrySchema.extend({
        type: z.literal('OccupationalHealthcare'),
        employerName: nonEmptyString,
        sickLeave: z.object({
          startDate: nonEmptyString,
          endDate: nonEmptyString,
        }).optional(),
      });
    case 'Hospital':
      return baseEntrySchema.extend({
        type: z.literal('Hospital'),
        discharge: z.object({
          date: nonEmptyString,
          criteria: z.string().optional(),
        }),
      });
    default:
      throw new Error(`Unknown entry type: ${type}`);
  }
};

// Create a union of all entry schemas
export const newVisitEntrySchema = z.union([
  createEntrySchema('HealthCheck'),
  createEntrySchema('OccupationalHealthcare'),
  createEntrySchema('Hospital'),
]);

export const diagnoseEntrySchema = z.object({
  code: z.string(),
  name: z.string(),
  latin: z.string().optional(),
});

// Utility functions
export const toNewPatient = (object: unknown): NewPatient => {
  const parsedEntry = newEntrySchema.parse(object);
  return parsedEntry;
};

export const toNewVisitEntry = (object: unknown): NewEntry => {
  console.log(object);
  const parsedEntry = newVisitEntrySchema.parse(object);
  return parsedEntry;
};

export const newEntrySchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
});

export default newEntrySchema;
