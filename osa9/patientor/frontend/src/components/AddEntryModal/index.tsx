import { Dialog, DialogTitle, DialogContent, Divider, Alert } from '@mui/material';

import AddEntryForm from "./AddEntryForm";
import { DiagnoseEntry, EntryFormValues } from "../../../../shared/types/types";

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: EntryFormValues) => void;
  errors?: string[];
  diagnoses?: DiagnoseEntry[]
}

const AddEntryModal = ({ modalOpen, onClose, onSubmit, errors, diagnoses }: Props) => (
  <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
    <DialogTitle>Add a new entry</DialogTitle>
    <Divider />
    <DialogContent><>
      {errors && <>{errors.map((e,idx)=>{return(<div key={idx}><Alert severity="error">{e}</Alert></div>);})}</>}
      <AddEntryForm onSubmit={onSubmit} onCancel={onClose} diagnoses={diagnoses}/>
      </>
    </DialogContent>
  </Dialog>
);

export default AddEntryModal;
