import {z} from 'zod';
import {Weather, Visibility} from '../../flight-diary/src/types'

export const newDiarySchema =z.object({
  date: z.string(),
  weather: z.nativeEnum(Weather),
  visibility: z.nativeEnum(Visibility),
  comment: z.string()
});