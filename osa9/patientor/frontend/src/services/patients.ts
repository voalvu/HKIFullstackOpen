import axios from "axios";
import { Patient, PatientFormValues, EntryFormValues } from '../../../shared/types/types';

import { apiBaseUrl } from "../constants";

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

const createEntry = async (object: EntryFormValues, id: string) => {
  console.log("creating entry", object);
  try {
    const { data } = await axios.post<Patient>(
      `${apiBaseUrl}/patients/${id}/entries`,
      object,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );
    console.log(data);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; // Rethrow the error if you want to handle it further up the call stack
  }
};

export default {
  getAll, create, getById, createEntry
};

