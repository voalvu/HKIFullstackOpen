import express from 'express';
import patientService from '../services/patientService';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.post('/', (req, res) => {
    const newPatient = patientService.addPatient(req.body);
    const nonSensitive = patientService.getNonSensitiveById(newPatient.id);
    res.send(nonSensitive);
});

export default router;