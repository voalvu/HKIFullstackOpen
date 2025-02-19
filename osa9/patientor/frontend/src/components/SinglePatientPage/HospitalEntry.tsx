import DiagnosesList from './DiagnosesList';
import {DiagnoseEntry, HospitalEntry} from '../../../../shared/types/types';

interface Props{
  entry:HospitalEntry
  diagnoses?:DiagnoseEntry[];
}
const Hospital = ({entry,diagnoses}:Props):JSX.Element | null => {
  return(<>
    {entry.date} {entry.description} 
    <ul>
      {entry.diagnosisCodes ? 
            <DiagnosesList codes={entry.diagnosisCodes}
              diagnoses={diagnoses}
            ></DiagnosesList>
      :null}

          </ul>
    </>
  );
};

export default Hospital;