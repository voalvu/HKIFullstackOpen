

import { z } from 'zod';
import { NewPatientEntry, Gender } from './types';

export const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  const parsedEntry = newEntrySchema.parse(object);
  return parsedEntry;
};

export const newEntrySchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string()
});

export default newEntrySchema;