import express from 'express';
import calculateBmi from './bmi'; // Ensure this path is correct
import calculateExercises from './exerciseCalculator';
/* declare global {
  namespace Express {
      interface Request {
          rawBody?: Buffer; // Add the rawBody property
          rawerBody?: Buffer;
      }
  }
} */

const app = express();



app.use(express.json());




// Sample routes
app.get('/ping', (_req, res) => {
    res.send('pong');
});

app.get('/hello', (_req, res) => {
    res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    console.log(req.body);
    //res.send("your bmi");
    const { height, weight } = req.query;
    if(Number(height) && Number(weight)) {
      const bmi = calculateBmi(Number(height), Number(weight));
      res.send({
        weight: weight,
        height: height,
        bmi: bmi
      });
      //res.send(`Your BMI is ${bmi}`);
      return;
    
  } else {
    res.status(400).send({
      error: "malformatted parameters",
      info:'Height and weight are required. Both have to be numbers',
    });
}
});

app.post('/bmi', (req, res) => {
    console.log('hello');
    console.log(req.body);
    
    // Ensure height and weight are present
     
    const { height, weight } = req.query;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { heightFromBody, weightFromBody } = req.body;
    if(Number(height) && Number(weight)) {
      const bmi = calculateBmi(Number(height), Number(weight));
      res.send(`Your BMI is ${bmi}`);
      return;
    }
    
    else if (heightFromBody && weightFromBody) {
        const bmi = calculateBmi(Number(heightFromBody), Number(weightFromBody));
        res.send(`Your BMI is ${bmi}`);
        
    } else {
        res.status(400).send('Height and weight are required');
    }
});

import { Request, Response } from 'express';

interface ExerciseData {
  daily_exercises: number[];
  target: number;
}

app.post('/exercises', (req: Request, res: Response) => {
  const { daily_exercises, target } = req.body as ExerciseData;

  // Check if all required parameters are present
  if (!daily_exercises || !target) {
    res.status(400).send({ error: "parameters missing" });
    return;
  }

  // Validate types
  if (typeof target !== 'number' || !Array.isArray(daily_exercises) || 
      !daily_exercises.every(day => typeof day === 'number')) {
    res.status(400).send({
      error: "malformatted parameters",
      info: "daily_exercises must be an array of numbers and target must be a number"
    });
    return;
  }

  // If validation passes, calculate and send the result
  res.send(calculateExercises(daily_exercises, target));
});

const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
