// exerciseCalculator.ts

interface ExerciseResult {
    periodLength: number;
    trainingDays: number;
    target: number;
    average: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
};


const calculateExercises = (dailyHours: number[], target: number): ExerciseResult | string => {
    let check = false;
    dailyHours.forEach(dh => isNaN(dh) ? check=true : null);
    if(isNaN(target) || check){
        return "give target and all day hours as numbers";
    }

    const periodLength = dailyHours.length;
    const trainingDays = dailyHours.filter(hours => hours > 0).length;
    const average = dailyHours.reduce((sum, hours) => sum + hours, 0) / periodLength;
    const success = average >= target;

    let rating: number;
    let ratingDescription: string;

    if (average < target-0.2) {
        rating = 1;
        ratingDescription = "exercise more.";
    }
    else if (average < target) {
            rating = 1;
            ratingDescription = "almost hit target. exercise more.";
    } else if (Math.abs(target - average)<0.5 && average>=target) {
        rating = 2;
        ratingDescription = "target met";
    } else {
        rating = 3;
        ratingDescription = "exceeded your target. good job";
    }

    return {
        periodLength,
        trainingDays,
        target,
        average,
        success,
        rating,
        ratingDescription
    };
};


/* if(process.argv[2] && process.argv[3])
    console.log(calculateExercises(Array.from(process.argv.slice(3).map(n => Number(n))),Number(process.argv[2])));
else if(process.argv[2]){
    console.log("provide target and training hours");
}
else{    console.log('calculating target:2 days: [3, 0, 2, 4.5, 0, 3, 1]');
    // Example usage
const exerciseData =[3, 0, 2, 4.5, 0, 3, 1]; // Example data for a week
const targetHours = 2; // Target hours per day
console.log(calculateExercises(exerciseData, targetHours));
} */

export default calculateExercises;