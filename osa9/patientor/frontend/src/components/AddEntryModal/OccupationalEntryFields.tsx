import { TextField } from "@mui/material";
import { SickLeave } from "../../../../shared/types/types";

interface Props{
    employerName:string;
    setEmployerName:React.Dispatch<React.SetStateAction<string>>;
    sickLeave:SickLeave;
    setSickLeave:React.Dispatch<React.SetStateAction<SickLeave>>;
}

const OccupationalEntryFields = ({employerName,setEmployerName,sickLeave,setSickLeave}:Props) => {

    return(
        <div>
          <TextField
            label="employer Name"
            placeholder="Employer name"
            fullWidth
            value={employerName}
            onChange={({ target }) => setEmployerName(target.value)}
          />
          <label>sick leave start</label><input value={sickLeave.startDate}
          onChange={({ target }) => setSickLeave({...sickLeave, startDate: target.value})} type="date"/>
          <label>sick leave end</label><input value={sickLeave.endDate}
            onChange={({ target }) => setSickLeave({...sickLeave, endDate: target.value})}
            type="date"/>
          <TextField
            label="sick leave start"
            placeholder="YYYY-MM-DD"
            fullWidth
            value={sickLeave.startDate}
            onChange={({ target }) => setSickLeave({...sickLeave, startDate: target.value})}
          />
          <TextField
            label="sick leave end"
            placeholder="YYYY-MM-DD"
            fullWidth
            value={sickLeave.endDate}
            onChange={({ target }) => setSickLeave({...sickLeave, endDate: target.value})}
          />
        </div>
      );
      
};

export default OccupationalEntryFields;