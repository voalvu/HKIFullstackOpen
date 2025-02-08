type Result = string;


const calculateBmi = (height: number, weight: number): Result => {
    if(isNaN(height) || isNaN(weight))
        return "only number inputs allowed"
    const BMI = weight / (height / 100) ** 2;

    if (BMI < 16.0) {
        return "Underweight (Severe thinness)";
    } else if (BMI < 17.0) {
        return "Underweight (Moderate thinness)";
    } else if (BMI < 18.5) {
        return "Underweight (Mild thinness)";
    } else if (BMI < 25.0) {
        return "Normal range";
    } else if (BMI < 30.0) {
        return "Overweight (Pre-obese)";
    } else if (BMI < 35.0) {
        return "Obese (Class I)";
    } else if (BMI < 40.0) {
        return "Obese (Class II)";
    } else {
        return "Obese (Class III)";
    }
};

if(process.argv[2] && process.argv[3])
    console.log(calculateBmi(Number(process.argv[2]),Number(process.argv[3])))
else if(process.argv[2]){
    console.log("provide height and weight")
}
else{    console.log('calculating 180cm,74kg')
    console.log(calculateBmi(180, 74));
}

export default calculateBmi