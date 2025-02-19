import axios from "axios";
import { apiBaseUrl } from "../constants";
import { DiagnoseEntry } from "../../../patientor-backend/src/types";

const getAll = async () => {
  const { data } = await axios.get<DiagnoseEntry[]>(
    `${apiBaseUrl}/diagnoses`
  );

  return data;
};

/* const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
};

const getById = async (id: string): Promise<Patient> => {
  const { data } = await axios.get<Patient>(
    `${apiBaseUrl}/patients/${id}`,
  );
  return data;
}; */

export default {
  getAll
};

