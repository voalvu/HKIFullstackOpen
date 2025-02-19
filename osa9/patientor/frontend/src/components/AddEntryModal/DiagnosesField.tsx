import { TextField, Chip, FormControl, Autocomplete } from "@mui/material";
import { DiagnoseEntry } from "../../../../shared/types/types";

interface Props {
    diagnosticCodes: Array<DiagnoseEntry['code']>;
    setDiagnosticCodes: React.Dispatch<React.SetStateAction<Array<DiagnoseEntry['code']>>>;
    diagnoses?: DiagnoseEntry[];
}

const DiagnoseCodesInput = ({ diagnosticCodes, setDiagnosticCodes, diagnoses }: Props) => {
    const handleAutocompleteChange = (event: React.SyntheticEvent, newValue: string[]) => {
        setDiagnosticCodes(newValue);
    };

    // Sort and stringify diagnoses into options
    const diagnosticOptions = diagnoses 
        ? diagnoses.sort((a, b) => a.code.localeCompare(b.code)).map(diagnose => `${diagnose.code}: ${diagnose.name}`)
        : [];

    return (
        <FormControl fullWidth>
            <Autocomplete
                multiple
                fullWidth
                options={diagnosticOptions}
                value={diagnosticCodes}
                onChange={handleAutocompleteChange}
                freeSolo
                disablePortal={false}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip
                            key={index}
                            label={option.split(':')[0]}
                            {...getTagProps({ index })}
                            style={{ margin: 2 }}
                        />
                    ))
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        label="Diagnose Codes"
                        placeholder="Add or select diagnostic codes"
                    />
                )}
                PaperComponent={({ children }) => (
                    <div style={{
                        maxHeight: 200, // Fixed max height for dropdown
                        //overflowY: 'auto', // Single scrollbar for dropdown
                        overflowX: 'hidden', // Prevent horizontal scrollbar
                        backgroundColor: '#fff',
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        position: 'absolute',
                        zIndex: 1300, // Higher z-index to ensure it stays on top
                        width: '100%', // Match the width of the input
                    }}>{children}</div>
                )}
                renderOption={(props, option, { selected }) => (
                    <li
                        {...props}
                        style={{
                            backgroundColor: selected ? 'green' : 'transparent',
                            color: selected ? 'white' : 'black',
                            padding: '8px 16px',
                            cursor: 'pointer',
                        }}
                    >
                        {option}
                    </li>
                )}
            />
        </FormControl>
    );
};

const DiagnoseCodesField = ({ diagnosticCodes, setDiagnosticCodes, diagnoses }: Props) => {
    return (
        <div id="diagnose-codes-input" style={{ position: 'relative' }}> {/* Ensure relative positioning for context */}
            <DiagnoseCodesInput
                diagnosticCodes={diagnosticCodes}
                setDiagnosticCodes={setDiagnosticCodes}
                diagnoses={diagnoses}
            />
        </div>
    );
};

export default DiagnoseCodesField;