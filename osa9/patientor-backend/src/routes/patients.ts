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

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.post('/', (req, res) => {
    const newPatient = patientService.addPatient(req.body);
    const nonSensitive = patientService.getNonSensitiveById(newPatient.id);
    res.send(nonSensitive);
});

router.use(errorMiddleware);

export default router;