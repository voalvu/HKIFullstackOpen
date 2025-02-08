const multiplicator = (a: number, b:number, printText:string) => {
    console.log(printText,  a * b);
  }
  
  multiplicator(2, 4, 'Multiplied numbers 2 and 4, the result is:');

  //multiplicator(2, 'Lol', 'Multiplied numbers 2 and 4, the result is:');


  type Operation = 'multiply' | 'add' | 'divide';


  type Result = string | number;

const calculator = (a: number, b: number, op: Operation): Result => {
  if (op === 'multiply') {
    return a * b;
  } else if (op === 'add') {
    return a + b;
  } else if (op === 'divide') {
    if (b === 0) return 'can\'t divide by 0!';
    return a / b;
  }
}

const res = calculator(10,20,'multiply')
console.log(res)

const calculator_switch = (a: number, b: number, op: Operation) : number => {
    switch(op) {
      case 'multiply':
        return a * b;
      case 'divide':
        if (b === 0) throw new Error('Can\'t divide by 0!');
        return a / b;
      case 'add':
        return a + b;
      default:
        throw new Error('Operation is not multiply, add or divide!');
    }
  }

  console.log(calculator_switch(5,5,"add"))

  try {
    console.log(calculator(1, 5 , 'divide'));
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong: '
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    console.log(errorMessage);
  }