import { TextField } from "@mui/material";
import { Discharge } from "../../../../shared/types/types";

interface Props{
    discharge:Discharge
    setDischarge:React.Dispatch<React.SetStateAction<Discharge>>;
}
export const HospitalEntryFields = ({discharge,setDischarge}:Props)=>{
        //console.log(discharge,setDischarge)
      return(
    <div>
      <TextField
        label="discharge date"
        placeholder="YYYY-MM-DD"
        fullWidth
        value={discharge.date}
        onChange={({ target }) => setDischarge({...discharge, date: target.value})}
      />
      <TextField
        label="discharge criteria"
        placeholder="criteria"
        fullWidth
        value={discharge.criteria}
        onChange={({ target }) => setDischarge({...discharge, criteria: target.value})}
      />
    </div>
  )};
export default HospitalEntryFields;