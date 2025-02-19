import express, { Request, Response, NextFunction } from 'express';
import patientService from '../services/patientService';
import {z} from 'zod';

const router = express.Router();

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => { 
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      next(error);
    }
  };

router.get('/', (_req:Request, res:Response) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.post('/', (req: Request, res:Response) => {
    const newPatient = patientService.addPatient(req.body as object);
    const nonSensitive = patientService.getNonSensitiveById(newPatient.id);
    res.send(nonSensitive);
});

router.post('/:id/entries', (req: Request, res: Response) => {
  try {
    // Adding entry to patient record
    const updatedPatientWithNewEntry = patientService.addEntry(req.body as object, req.params.id);
    res.status(200).send(updatedPatientWithNewEntry);
  } catch (error) {
    console.error("Error adding entry:", error);
    if (error instanceof Error) {
      res.status(400).json( {message: error} ); // Return a JSON response with the error message
    } else {
      res.status(400).json({ message: 'Unknown error' }); // Handle unknown error type
    }
  }
});


router.get('/:id',(req,res)=>{
  res.send(patientService.getById(req.params.id));
});

router.use(errorMiddleware);

export default router;