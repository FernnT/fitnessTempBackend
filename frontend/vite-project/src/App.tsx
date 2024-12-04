import { useEffect, useState } from 'react'
import  axios  from 'axios'
import './App.css'

//THIS IS JUST TEMP TO TEST THE API'S
function App() {
  const [exercises, setExercises] = useState([])
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | undefined>(undefined)
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([])

///////////////////////// Fetch Exercises //////////////////////////
  useEffect(() => {
  const fetchData = async () => {
    try {
      const results = await axios.get('http://localhost:3000/exercise/getExercises');
      console.log(results.data);
      setExercises(results.data);
    } catch (err) {
      console.log(err);
    }
  };
  fetchData();
}, [])
///////////////////////// Fetch Exercises //////////////////////////

///////////////////////// Styles //////////////////////////
const exerciseStyle = {
  padding: '10px',
  margin: '5px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  cursor: 'pointer',
  backgroundColor: '#060270'
};
///////////////////////// Styles //////////////////////////

///////////////////////// Types //////////////////////////
interface Exercise { //TODO: Add more properties as needed
  id: number;
  name: string;
  difficulty: string;
}
interface WorkoutPlan {
  user_id: number;
  exercises: Exercise[];
  name: string;
  level: string;
  duration_days: number;
  goal: string;
  progress: number;
  start_date: Date;
  end_date: Date;
}
///////////////////////// Types //////////////////////////

///////////////////////// FUNCTIONS //////////////////////////
const handleClick = (exercise: Exercise) => {
  setSelectedExercises(prevSelectedExercises => [...prevSelectedExercises, exercise]);
  console.log('Selected Exercises:', [...selectedExercises, exercise]);
}

const createWorkoutPlan = () =>{
  const workoutPlan = {
    user_id: 1,
    exercises: selectedExercises,
    name: 'My Workout Plan', //The user should set this. THis is just a test
    level: 'Beginner',      //The user should set this. THis is just a test or maybe we can set it based on the exercises selected
    duration_days: 30,      ////The user should set this. THis is just a test
    goal: 'Weight Loss',    //The user should set this. THis is just a test
    progress: 0,            //This should be set to 0 when the workout plan is created
    start_date: new Date(), //The user should set this. THis is just a test
    end_date: new Date(),    //This should be set to the current date + duration_days when the workout plan is created
    completed: false        //This should be set to false when the workout plan is created
  }
  setWorkoutPlan(workoutPlan);
  console.log('Workout Plan created:', workoutPlan);
}
///////////////////////// FUNCTIONS //////////////////////////

  return (
    <>
       <div>
        {exercises.map((exercise, index) => (
          <div key={index} onClick={() => handleClick(exercise)} style={exerciseStyle}>
            {exercise.difficulty} || {exercise.name}
          </div>
        ))}
      </div>
      <button onClick={createWorkoutPlan}>Create Workout Plan</button>
    </>
  )
}

export default App
