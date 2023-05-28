import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../../../../components/ui/coachLayout";
import Cookie from "js-cookie";

function AddExercise() {
  const [workout, setWorkout] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    sets: "",
    reps: "",
    cadence: "",
    notes: "",
  });
  const router = useRouter();
  const token = Cookie.get("token");
  const { workoutId, dayId, exerciseId } = router.query;

  useEffect(() => {
    if (workoutId) {
      axios
        .get(process.env.NEXT_PUBLIC_API_URL + `/workouts/list/by-id/${workoutId}`, {
          headers: { Authorization: `${token}` },
        })
        .then((response) => {
          const day = response.data.days.find((d) => d._id === dayId);
          const exercise = day.exercises.find((e) => e._id === exerciseId);
          setWorkout({ ...response.data, days: [day] });
          setExercise(exercise);
          setFormValues({
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            cadence: exercise.cadence,
            notes: exercise.notes,
          });
        })
        .catch((error) => console.error(error));
    }
  }, [workoutId, dayId, exerciseId, token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedExercise = { ...formValues };
    axios
      .post(
        process.env.NEXT_PUBLIC_API_URL +
          `/workouts/create/${workoutId}/${dayId}`,
        updatedExercise,
        { headers: { Authorization: `${token}` } }
      )
      .then(() => {
        alert("Exercise added!");
        router.push(`/coach/dashboard/workouts/${workoutId}`);
      })
      .catch((error) => console.error(error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <Layout>
      <h1 className={"font-thin font-lato text-4xl m-4"}>Add Exercise</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name"></label>
          <input
            type="text"
            name="name"
            className={"input input-ghost w-full max-w-xs m-4"}
            placeholder={"Exercise Name"}
            value={formValues.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="sets"></label>
          <input
            type="text"
            name="sets"
            className={"input input-ghost w-full max-w-xs m-4"}
            placeholder={"Sets"}
            value={formValues.sets}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="reps"></label>
          <input
            type="text"
            name="reps"
            className={"input input-ghost w-full max-w-xs m-4"}
            placeholder={"Reps"}
            value={formValues.reps}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="cadence"></label>
          <input
            type="text"
            name="cadence"
            className={"input input-ghost w-full max-w-xs m-4"}
            placeholder={"Cadence"}
            value={formValues.cadence}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="notes"></label>
          <input
            type="text"
            name="notes"
            className={"textarea textarea-ghots m-4 w-full max-w-xs"}
            placeholder={"Notes"}
            value={formValues.notes}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="video"></label>
          <input
            type="text"
            name="video"
            className={"input input-ghost w-full max-w-xs m-4"}
            placeholder={"Video"}
            value={formValues.video}
            onChange={handleChange}
          />
        </div>
        <button className={"btn btn-success"} type="submit">
          Add Exercise
        </button>
      </form>
    </Layout>
  );
}

export default AddExercise;
