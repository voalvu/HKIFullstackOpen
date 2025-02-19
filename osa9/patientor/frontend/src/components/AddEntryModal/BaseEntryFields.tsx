import { InputLabel, Select, MenuItem, TextField, SelectChangeEvent } from "@mui/material";
import { useEffect } from 'react';
import { EntryTypeEnum, TypeOption } from "../../../../shared/types/types";

interface Props{
    type:EntryTypeEnum;
    setType: React.Dispatch<React.SetStateAction<EntryTypeEnum>>;
    specialist: string
    setSpecialist: React.Dispatch<React.SetStateAction<string>>;
    description: string
    setDescription: React.Dispatch<React.SetStateAction<string>>;
}

const BaseEntryFields = ({type,setType,specialist,setSpecialist,description,setDescription}: Props ) => {

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
        value={diagnosisCodes}
        onFocus={({target})=> console.log(target.value)}
        onChange={({ target }) =>
        setdiagnosisCodes(
            parseDiagnosisCodes({diagnosisCodes: target.value.split(',')}))          }
        ref={popperAnchorRef}
    /> */}
{/*     <Popper open={diagnosisCodes.length > 0} anchorEl={popperAnchorRef.current}>
    <Paper>
    <List>
      {diagnosisCodes.map((code) => (
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