import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import HeartBrokenSharpIcon from '@mui/icons-material/HeartBrokenSharp';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import {DiagnoseEntry, HealthCheckEntry} from '../../../../shared/types/types';
import DiagnosesList from './DiagnosesList';
import { Icon } from '@mui/material';


interface Props{
  entry:HealthCheckEntry
  diagnoses?:DiagnoseEntry[];
}

const RatingIcon: { [key: number]: JSX.Element } = {
  0: <FavoriteTwoToneIcon htmlColor='green' />,
  1: <FavoriteTwoToneIcon htmlColor='orange' />,
  2: <FavoriteTwoToneIcon htmlColor='darkred' />,
  3: <HeartBrokenSharpIcon htmlColor='red' />,
};

const HealthCheck = ({entry,diagnoses}:Props):JSX.Element | null => {
  console.log(entry,entry.diagnosisCodes);
  return(<>{entry.date} <Icon><MonitorHeartIcon htmlColor='green'></MonitorHeartIcon></Icon> {entry.description} Rating: {entry.healthCheckRating} {RatingIcon[entry.healthCheckRating]}      <ul>
    {entry.diagnosisCodes ? 
                  <DiagnosesList diagnoses={diagnoses} codes={entry.diagnosisCodes}></DiagnosesList>
                  : null}
        </ul></>
      );
};
export default HealthCheck; 