import { DiagnoseEntry } from "../../../../shared/types/types";

interface Props{
  codes:string[];
  diagnoses?:DiagnoseEntry[];
}
const DiagnosesList = ({codes,diagnoses}:Props):JSX.Element | null => {
/*   const [diagnoses,setDiagnoses] = useState<DiagnoseEntry[]>([])
  
  useEffect(()=>{
    diagnoseService.getAll().then(res=>{setDiagnoses(res as DiagnoseEntry[])})
  },[]); */
  if(diagnoses)
  return(<>{codes.map((code,idx)=>{
      const diagnosis = diagnoses.find(d => d.code === code || d.code===code.split(":")[0]);
      return diagnosis ? (
      <li key={idx}>
        <b>{diagnosis.code}</b>: {diagnosis.name} {diagnosis.latin ? <i>{`(${diagnosis.latin})`}</i> : '' }</li>
        ) : null;
      }
    )
  }</>);
  else
  return null;
};

export default DiagnosesList;