import axios from "axios";
import { Patient, PatientFormValues } from "../../../patientor-backend/src/types";

import { apiBaseUrl } from "../constants";
import { EntryFormValues } from "../../../patientor-backend/src/types";

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};

const create = async (object: PatientFormValues) => {
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
};

const createEntry = async (object: EntryFormValues, id:string) => {
  console.log("creating entry",object)
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients/${id}/entries`,
    object
  );

  return data;
};

export default {
  getAll, create, getById, createEntry
};

