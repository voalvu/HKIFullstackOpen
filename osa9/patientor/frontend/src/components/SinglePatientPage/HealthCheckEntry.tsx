import {DiagnoseEntry, HealthCheckEntry} from '../../../../shared/types/types';
import DiagnosesList from './DiagnosesList';


interface Props{
  entry:HealthCheckEntry
  diagnoses?:DiagnoseEntry[];
}


const HealthCheck = ({entry,diagnoses}:Props):JSX.Element | null => {
  console.log(entry,entry.diagnosisCodes);
  return(<>{entry.date} {entry.description} Rating: {entry.healthCheckRating}     <ul>
    {entry.diagnosisCodes ? 
                  <DiagnosesList diagnoses={diagnoses} codes={entry.diagnosisCodes}></DiagnosesList>
                  : null}
        </ul></>
      );
};
export default HealthCheck; 