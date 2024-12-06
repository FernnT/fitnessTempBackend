import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
//////////////////////////States//////////////////////////
  const [exercises, setExercises] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [showExercise, setShowExercise] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const navigate = useNavigate();

//////////////////////////States//////////////////////////
///////////////////////////USeEffect//////////////////////////
  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await axios.get('http://localhost:3000/exercise/getExercises');
        console.log('Exercises:', results.data);//TODO: remove
        setExercises(results.data);
        const workoutPlanResults = await axios.get('http://localhost:3000/workoutPlan/getWorkoutPlans');//TODO: it should by userId
        setWorkoutPlan(workoutPlanResults.data);
        console.log('Workout Plans:', workoutPlanResults.data);//TODO: remove
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
///////////////////////////USeEffect//////////////////////////
///////////////////////////Functions//////////////////////////
  const handleWorkoutPlanClick = (id) => {
    console.log(id);
    navigate(`/workoutPlan/${id}`);
  }

  const handleSubmitWorkoutPlan = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        name: e.target.name.value,
        goal: e.target.goal.value, 
        durationDays: parseInt(e.target.duration.value),
        userId: 2 // TODO: Get actual userId from auth
      };
      
      const response = await axios.post('http://localhost:3000/workoutPlan/createWorkoutPlan', formData);
      setWorkoutPlan([...workoutPlan, response.data]);
      setShowForm(false);
      e.target.reset();
    } catch (err) {
      console.error(err);
      setErrors({ submit: err.message });
    }
  };


  ///////////////////////////Functions//////////////////////////
  return (
    <>
      <h1>Workout Plans</h1>
      {workoutPlan.map((plan) => (
        <div key={plan.planId} onClick={() => handleWorkoutPlanClick(plan.planId)} style={{cursor: 'pointer', border: '1px solid black', padding: '10px', margin: '10px'}}>
          <h2>{plan.name}</h2>
          <h3>{plan.goal}</h3>
          <h3>{plan.durationDays} days</h3>
        </div>
      ))}

      <button onClick={() => setShowForm(!showForm)} style={{ margin: '20px' }}>
        Create New Workout Plan
      </button>

      {showForm && (
        <div style={{ border: '1px solid black', padding: '20px', margin: '10px' }}>
          <form onSubmit={handleSubmitWorkoutPlan}>

            <div style={{ margin: '10px 0' }}>
              <label htmlFor="name">Workout Plan Name: </label>
              <input type="text" id="name" name="name" required />
            </div>

            <div style={{ margin: '10px 0' }}>
              <label htmlFor="goal">Goal: </label>
              <input type="text" id="goal" name="goal" required />
            </div>

            <div style={{ margin: '10px 0' }}>
              <label htmlFor="duration">Duration (days): </label>
              <input type="number" id="duration" name="duration" min="1" required />
            </div>

            <button type="submit">Create Plan</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
          {errors.submit && <p style={{ color: 'red' }}>{errors.submit}</p>}
        </div>
      )}
    </>
  );
}

export default App;