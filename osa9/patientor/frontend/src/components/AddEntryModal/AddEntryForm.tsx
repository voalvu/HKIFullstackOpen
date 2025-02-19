import { useState, SyntheticEvent } from "react";
import {Grid, Button} from '@mui/material';
import { EntryTypeEnum, HealthCheckRating, EntryFormValues, Discharge, SickLeave, DiagnoseEntry } from "../../../../shared/types/types";

import HealthCheckEntryFields from './HealthCheckEntryFields';
import HospitalEntryFields from './HospitalEntryFields';
import OccupationalEntryFields from './OccupationalEntryFields';
import BaseEntryFields from './BaseEntryFields';
import DiagnoseCodesField from "./DiagnosesField";

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryFormValues) => void;
  diagnoses?: DiagnoseEntry[]
}



/* const typeOptions: TypeOption[] = Object.values(EntryTypeEnum).map(v => ({
  value: v.toString()
})); */



//const suggestions = ['lol']

const AddEntryForm = ({ onCancel, onSubmit, diagnoses }: Props) => {
  
  const [type, setType] = useState<EntryTypeEnum>(EntryTypeEnum.HealthCheck);
  const [specialist, setSpecialist] = useState('');
  const [description, setDescription] = useState('');
  const [diagnosticCodes, setDiagnosticCodes] = useState<Array<DiagnoseEntry['code']>>([]);
  const [rating, setRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);
  const [employerName, setEmployerName] = useState('');
  const [sickLeave, setSickLeave] = useState<SickLeave>({ startDate: '', endDate: '' });
  const [discharge, setDischarge] = useState<Discharge>({ date: '', criteria: '' });
  
  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    const baseEntry = {
      specialist,
      description,
      diagnosticCodes
    };  
    console.log("submitting current type:",type);

    switch(type){
      case EntryTypeEnum.HealthCheck:
        return onSubmit({
          ...baseEntry,
          type: "HealthCheck",
          healthCheckRating: rating,
        });
      case EntryTypeEnum.Occupational:
        return onSubmit({
          ...baseEntry,
          type: "OccupationalHealthcare",
          employerName,
          sickLeave,
        });
      case EntryTypeEnum.Hospital:
        return onSubmit({
          ...baseEntry,
          type: "Hospital",
          discharge,
        });
      default:
        return Error('Wrong entry type');
    }
  };

  return (
    <div>
      <form onSubmit={addEntry}>
        <BaseEntryFields
          type={type}
          setType={setType}
          specialist={specialist}
          setSpecialist={setSpecialist}
          description={description}
          setDescription={setDescription}
        />
        
        {type === EntryTypeEnum.HealthCheck ? (
          <HealthCheckEntryFields
            rating={rating}
            setRating={setRating}
          />
        ) : type === EntryTypeEnum.Occupational ? (
          <OccupationalEntryFields
            employerName={employerName}
            setEmployerName={setEmployerName}
            sickLeave={sickLeave}
            setSickLeave={setSickLeave}
          />
        ) : (
          <HospitalEntryFields
            discharge={discharge}
            setDischarge={setDischarge}
          />
        )}

        <DiagnoseCodesField diagnosticCodes={diagnosticCodes}
          setDiagnosticCodes={setDiagnosticCodes} diagnoses={diagnoses}>
            
        </DiagnoseCodesField>
        
        <Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: "left" }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: "right",
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddEntryForm;