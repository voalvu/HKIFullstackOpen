import DiagnosesList from './DiagnosesList';
import {DiagnoseEntry, OccupationalHealthcareEntry} from '../../../../shared/types/types';


interface Props{
  entry:OccupationalHealthcareEntry
  diagnoses?:DiagnoseEntry[];
}

const OccupationalEntry = ({entry,diagnoses}:Props):JSX.Element | null => {
  return(<>{entry.date} {entry.description} <ul>{entry.diagnosisCodes ?<DiagnosesList diagnoses={diagnoses} codes={entry.diagnosisCodes}></DiagnosesList>
:null    }</ul></>);
};

export default OccupationalEntry;