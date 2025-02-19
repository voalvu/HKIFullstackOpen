import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Button, Divider, Container, Typography } from '@mui/material';

import { Patient } from "../../patientor-backend/src/types";
import SinglePatientPage from "./components/SinglePatientPage";

import patientService from "./services/patients";
import PatientListPage from "./components/PatientListPage";


const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
     patientService.getAll().then(res => (setPatients(res as Patient[])));
  }, []);
  
  return (
    <div className="App">
      <Router>
        <Container>
          <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Button component={Link} to="/patients" variant="contained" color="primary">
            Patients
          </Button>
          <Divider hidden />
          <Routes>
            <Route path="/" element={<PatientListPage patients={patients} setPatients={setPatients} />} />
            <Route path="/patients" element={<PatientListPage patients={patients} setPatients={setPatients} />} />
            <Route path="/patients/:id" element={<SinglePatientPage/>} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
