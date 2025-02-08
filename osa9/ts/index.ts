import express from 'express';
import calculateBmi from './bmi'; // Ensure this path is correct

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
      })
      //res.send(`Your BMI is ${bmi}`);
      return
    
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
    if(Number(height) && Number(weight)) {
      const bmi = calculateBmi(Number(height), Number(weight));
      res.send(`Your BMI is ${bmi}`);
      return
    }
    else if (req.body.height && req.body.weight) {
        const bmi = calculateBmi(req.body.height, req.body.weight);
        res.send(`Your BMI is ${bmi}`);
        
    } else {
        res.status(400).send('Height and weight are required');
    }
});

const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
