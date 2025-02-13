

import { z } from 'zod';
import { NewPatient, Gender } from './types';

export const toNewPatient = (object: unknown): NewPatient => {
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