import { InputLabel, Select, MenuItem, TextField, Popper, List, ListItem, Paper, SelectChangeEvent } from "@mui/material"
import { useRef, useEffect } from 'react';
import { DiagnoseEntry, EntryTypeEnum, TypeOption } from "../../../../shared/types/types";

interface Props{
    type:EntryTypeEnum;
    setType: React.Dispatch<React.SetStateAction<EntryTypeEnum>>;
    specialist: string
    setSpecialist: React.Dispatch<React.SetStateAction<string>>;
    description: string
    setDescription: React.Dispatch<React.SetStateAction<string>>;
}

const BaseEntryFields = ({type,setType,specialist,setSpecialist,description,setDescription}: Props ) => {

    const popperAnchorRef = useRef(null);

    useEffect(()=>{
        const savedType = localStorage.getItem('entryType');
        if(!type){
        if(savedType){
            setType(savedType ? (savedType as EntryTypeEnum) : EntryTypeEnum.HealthCheck);
        }
    }
    },[type,setType]);

  const onTypeChange = (event: SelectChangeEvent<EntryTypeEnum>) => {
    event.preventDefault();
    if (typeof event.target.value === "string") {
      const value = event.target.value;
      const type = Object.values(EntryTypeEnum).find(type => type.toString() === value);
      if (type) {
        setType(type);
        localStorage.setItem('entryType', type); // Save the selected type to localStorage
      }
    }
  };

  const typeOptions: TypeOption[] = Object.values(EntryTypeEnum).map(v => ({
    value: v.toString()
  }));

  const parseDiagnosisCodes = (object: unknown): Array<DiagnoseEntry['code']> =>  {
    if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
      return [] as Array<DiagnoseEntry['code']>;
    }
  
    return object.diagnosisCodes as Array<DiagnoseEntry['code']>;
  };
  

return (<div id="base-entry-fields">
    <InputLabel style={{ marginTop: 20 }}>Type of visit:</InputLabel>
        <Select
          label="type"
          fullWidth
          value={type}
          onChange={onTypeChange}
        >
          {typeOptions.map(option => (
            <MenuItem
              key={option.value}
              value={option.value}
            >
              {option.value}
            </MenuItem>
          ))}
        </Select>
        <TextField
          label="description"
          placeholder="Description"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <TextField
          label="specialist"
          fullWidth 
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />
{/*     <TextField
        label="Diagnose codes"
        placeholder="code"
        fullWidth
        value={diagnosticCodes}
        onFocus={({target})=> console.log(target.value)}
        onChange={({ target }) =>
        setDiagnosticCodes(
            parseDiagnosisCodes({diagnosisCodes: target.value.split(',')}))          }
        ref={popperAnchorRef}
    /> */}
{/*     <Popper open={diagnosticCodes.length > 0} anchorEl={popperAnchorRef.current}>
    <Paper>
    <List>
      {diagnosticCodes.map((code) => (
        <ListItem button key={code} onClick={(e) => {console.log(e)}}>
          {code}
        </ListItem>
      ))}
    </List>
    </Paper>
    </Popper> */}
    </div>

    );
};



export default BaseEntryFields ;