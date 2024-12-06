import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function WorkoutPlan() {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [userWorkoutExercises, setUserWorkoutExercises] = useState([]);
  const [exercisesDetails, setExercisesDetails] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { id } = useParams();
  const [errors, setErrors] = useState({});
/////////////////////FETCH DATA/////////////////////
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch workout plan details
        const workoutPlanResult = await axios.get(`http://localhost:3000/workoutPlan/${id}`);
        setWorkoutPlan(workoutPlanResult.data[0]);
        console.log(workoutPlanResult.data[0]);

        // Fetch user workout exercises for this plan
        const exercisesResult = await axios.get(`http://localhost:3000/userWorkoutExercise/${id}`);
        setUserWorkoutExercises(exercisesResult.data);
        console.log(exercisesResult.data);  

        // Fetch exercises details
        const exercisesDetailsResult = await axios.get(`http://localhost:3000/exercise/getExercises`);
        setExercisesDetails(exercisesDetailsResult.data);
        console.log(exercisesDetailsResult.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id]);
/////////////////////FETCH DATA/////////////////////
  const handleSubmit = async (e) => {
    try {
      const formData = {
        exerciseId: parseInt(e.target.exercise.value),
        planId: parseInt(id),
        sets: parseInt(e.target.sets.value),
        reps: parseInt(e.target.reps.value),
        weight: parseFloat(e.target.weight.value),
        durationMin: parseInt(e.target.duration.value),
        restTimePerSec: parseInt(e.target.restTime.value),
        day: e.target.day.value
      };
      
      const response = await axios.post('http://localhost:3000/userWorkoutExercise/addExercise', formData);
      setUserWorkoutExercises([...userWorkoutExercises, response.data]);
      setShowForm(false);
      e.target.reset();
    } catch (err) {
      console.error(err);
      setErrors({ submit: err.message });
    }
  };

  const handleDelete = async (exerciseId) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      try {
        await axios.delete(`http://localhost:3000/userWorkoutExercise/${exerciseId}`);
        setUserWorkoutExercises(userWorkoutExercises.filter(ex => ex.workoutExerciseId !== exerciseId));
      } catch (err) {
        console.error(err);
        setErrors({ delete: err.message });
      }
    }
  };

  const handleComplete = async (exercise) => {
    try {
      await axios.post(`http://localhost:3000/userWorkoutExercise/${exercise.workoutExerciseId}/complete`);
      setUserWorkoutExercises(userWorkoutExercises.map(ex => 
        ex.workoutExerciseId === exercise.workoutExerciseId 
          ? { ...ex, completed: true }
          : ex
      ));
    } catch (err) {
      console.error(err);
      setErrors({ complete: err.message });
    }
  };

  if (!workoutPlan) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{workoutPlan.name}</h1>
      <h2>Goal: {workoutPlan.goal}</h2>
      <h3>Duration: {workoutPlan.durationDays} days</h3>

      <h2>Exercises:</h2>
      {userWorkoutExercises.map((exercise) => {
        const exerciseDetail = exercisesDetails.find(
          detail => detail.exerciseId === exercise.exerciseId
        );

        return (
          <div key={exercise.workoutExerciseId} 
               style={{
                 border: '1px solid black', 
                 padding: '10px', 
                 margin: '10px',
                 backgroundColor: exercise.completed ? 'green' : ''
               }}>
            <h3>Exercise: {exerciseDetail ? exerciseDetail.name : 'Unknown Exercise'}</h3>
            <p>Sets: {exercise.sets}</p>
            <p>Reps: {exercise.reps}</p>
            <p>Weight: {exercise.weight} kg</p>
            <p>Duration: {exercise.durationMin} seconds</p>
            <p>Rest Time: {exercise.restTimePerSec} seconds</p>
            <p>Day: {exercise.day}</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              {!exercise.completed && (
                <button 
                  onClick={() => handleComplete(exercise)}
                  style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '5px 10px' }}
                >
                  Complete Exercise
                </button>
              )}
              <button 
                onClick={() => handleDelete(exercise.workoutExerciseId)}
                style={{ backgroundColor: '#ff4444', color: 'white', border: 'none', padding: '5px 10px' }}
              >
                Delete Exercise
              </button>
            </div>
            {exercise.completed && (
              <p style={{ color: '#4CAF50', marginTop: '5px' }}>✓ Completed</p>
            )}
          </div>
        );
      })}
      <button onClick={() => setShowForm(!showForm)} style={{ margin: '20px' }}>
        Add Exercise
      </button>

      {showForm && (
        <div style={{ border: '1px solid black', padding: '20px', margin: '10px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ margin: '10px 0' }}>
              <label htmlFor="exercise">Exercise: </label>
              <select id="exercise" name="exercise" required>
                {exercisesDetails.map(exercise => (
                  <option key={exercise.exerciseId} value={exercise.exerciseId}>
                    {exercise.name} ({exercise.bodyPart})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ margin: '10px 0' }}>
              <label htmlFor="sets">Sets: </label>
              <input type="number" id="sets" name="sets" min="1" required />
            </div>

            <div style={{ margin: '10px 0' }}>
              <label htmlFor="reps">Reps: </label>
              <input type="number" id="reps" name="reps" min="1" required />
            </div>

            <div style={{ margin: '10px 0' }}>
              <label htmlFor="weight">Weight (kg): </label>
              <input type="number" id="weight" name="weight" min="0" step="0.5" required />
            </div>

            <div style={{ margin: '10px 0' }}>
              <label htmlFor="duration">Duration (seconds): </label>
              <input type="number" id="duration" name="duration" min="0" required />
            </div>

            <div style={{ margin: '10px 0' }}>
              <label htmlFor="restTime">Rest Time (seconds): </label>
              <input type="number" id="restTime" name="restTime" min="0" required />
            </div>

            <div style={{ margin: '10px 0' }}>
              <label htmlFor="day">Day: </label>
              <select id="day" name="day" required>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>

            <button type="submit">Add Exercise</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
          {errors?.submit && <p style={{ color: 'red' }}>{errors.submit}</p>}
        </div>
      )}
    </div>
  );
}

export default WorkoutPlan;
