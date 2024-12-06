

const exerciseArr = [
    {
        exerciseId: 2, 
        name: 'Push-Up',
        sets: 3,
        reps: 10,
        duration_min: 0,
        weight: 0,
        distance: 0,
        calories_per_mins: 0,
        rest_time_sec: 60,
    },

    
]

const workoutPlan = {
    user_id: 1,
    exercises: exerciseArr, //The user should set this. THis is just a test
    name: 'My Workout Plan', //The user should set this. THis is just a test
    intesity: 'High',      //The user should set this. THis is just a test or maybe we can set it based on the exercises selected
    duration_days: 30,      ////The user should set this. THis is just a test
    goal: 'Weight Loss',    //The user should set this. THis is just a test
    progress: 0,            //This should be set to 0 when the workout plan is created
    start_date: new Date(), //The user should set this. THis is just a test
    end_date: new Date(),    //This should be set to the current date + duration_days when the workout plan is created
    completed: false        //This should be set to false when the workout plan is created
  }



   /////////////////////////
   import axios from 'axios';
import { useState, useEffect } from 'react';

function App() {
//////////////////////////States//////////////////////////
  const [exercises, setExercises] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    duration_days: '',
    goal: '',
    userId: '1'
  });
  const [errors, setErrors] = useState({});
  const [showExercise, setShowExercise] = useState(false);
  const [workoutPlans, setWorkoutPlans] = useState([]);

//////////////////////////States//////////////////////////
///////////////////////////USeEffect//////////////////////////
  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await axios.get('http://localhost:3000/exercise/getExercises');
        console.log(results.data);
        setExercises(results.data);
        const workoutPlanResults = await axios.get('http://localhost:3000/workoutPlan/getWorkoutPlans');
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
///////////////////////////USeEffect//////////////////////////
///////////////////////////Functions//////////////////////////
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.duration_days) newErrors.duration_days = 'Duration in days is required';
    if (!formData.goal) newErrors.goal = 'Goal is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log(formData);
      
      try{
        axios.post('http://localhost:3000/workoutPlan/createWorkoutPlan', formData)
      }catch(err){
        console.log(err);
    }
  };
  }
  ///////////////////////////Functions//////////////////////////
  return (
    <>
      <button onClick={() => setShowForm(!showForm)}>Create Exercise Plan</button>

    <div style={{display: 'flex', alignItems: 'center'}}>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Enter exercise name" value={formData.name} onChange={handleChange} />
          {errors.name && <span>{errors.name}</span>}
          <input type="number" name="duration_days" placeholder="Enter duration in days" value={formData.duration_days} onChange={handleChange} />
          {errors.duration_days && <span>{errors.duration_days}</span>}
          <input type="text" name="goal" placeholder="Enter goal" value={formData.goal} onChange={handleChange} />
          {errors.goal && <span>{errors.goal}</span>}
          {errors.start_date && <span>{errors.start_date}</span>}
          {errors.end_date && <span>{errors.end_date}</span>}
          <button type="submit">NEXT</button>
        </form>
      )}
        </div>
    </>
  );
}

export default App;