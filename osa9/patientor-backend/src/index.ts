import express from 'express';
import cors from 'cors';

import diagnosesRoute from './routes/diaries';
import patientsRoute from './routes/patients';
const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/diagnoses', diagnosesRoute);
app.use('/patients',patientsRoute);

app.get('/ping', (_req, res) => {
    res.send("pong");
});

app.get('/patients',(_req,res)=>{
    res.send("temp");
});


const PORT = 3003;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});