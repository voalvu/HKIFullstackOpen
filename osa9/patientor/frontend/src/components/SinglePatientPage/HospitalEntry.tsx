import DiagnosesList from './DiagnosesList';
import {DiagnoseEntry, HospitalEntry} from '../../../../shared/types/types';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
interface Props{
  entry:HospitalEntry
  diagnoses?:DiagnoseEntry[];
}
const Hospital = ({entry,diagnoses}:Props):JSX.Element | null => {
  return(<>
    {entry.date} <LocalHospitalIcon htmlColor="red"></LocalHospitalIcon> {entry.description} 
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