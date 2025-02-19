import DiagnosesList from './DiagnosesList';
import {DiagnoseEntry, OccupationalHealthcareEntry} from '../../../../shared/types/types';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

interface Props{
  entry:OccupationalHealthcareEntry
  diagnoses?:DiagnoseEntry[];
}

const OccupationalEntry = ({entry,diagnoses}:Props):JSX.Element | null => {
  return(<>{entry.date} <BusinessCenterIcon htmlColor='brown'></BusinessCenterIcon> {entry.description} <ul>{entry.diagnosisCodes ?<DiagnosesList diagnoses={diagnoses} codes={entry.diagnosisCodes}></DiagnosesList>
:null    }</ul></>);
};

export default OccupationalEntry;