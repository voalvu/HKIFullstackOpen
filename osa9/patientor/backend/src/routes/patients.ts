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

router.post('/:id/entries', (req: Request,res: Response) =>{
  // addding entry to patient record
  const updatedPatientWithNewEntry = patientService.addEntry(req.body as object,req.params.id);
  if(updatedPatientWithNewEntry){
    res.send(updatedPatientWithNewEntry);
/*   const nonSensitive = patientService.getNonSensitiveById(updatedPatientWithNewEntry.id);
    res.send(nonSensitive); */
  
}else{res.send("couldn't add entries");};
});

router.get('/:id',(req,res)=>{
  res.send(patientService.getById(req.params.id));
});

router.use(errorMiddleware);

export default router;