import diagnoseData from '../data/diagnoses';

import { DiagnoseEntry } from '../../../shared/types/types';

const diagnoses: DiagnoseEntry[] = diagnoseData as DiagnoseEntry[];


const getEntries = ():DiagnoseEntry[] => {
  return diagnoses;
};

const addDiagnose = () => {
  return null;
};

export default {
  getEntries,
  addDiagnose
};