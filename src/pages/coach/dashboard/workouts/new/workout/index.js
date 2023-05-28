import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../../../components/ui/coachLayout";
import Cookie from "js-cookie";
import { BsTrashFill } from "react-icons/bs";
import { toast } from "react-toastify";
export default function AddWorkout() {
  const [users, setUsers] = useState([]);
  const coachId = Cookie.get("user");

  const [formValues, setFormValues] = useState({
    assignedTo: "",
    coach: coachId,
    name: "",
    days: [
      {
        day: "",
        focus: "",
        exercises: [
          {
            name: "",
            sets: "",
            reps: "",
            cadence: "",
            notes: "",
            video: "",
          },
        ],
      },
    ],
  });
  const router = useRouter();
  const token = Cookie.get("token");

  useEffect(() => {
    axios
      .get(process.env.NEXT_PUBLIC_API_URL + `/users/by-coach/${coachId}`, {
        headers: { Authorization: `${token}` },
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => console.error(error));
  }, [coachId, token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newWorkout = { ...formValues };
    axios
      .post(process.env.NEXT_PUBLIC_API_URL + `/workouts/create`, newWorkout, {
        headers: { Authorization: `${token}` },
      })
      .then(() => {
        toast.success("Workout created successfully", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        router.push("/coach/dashboard/workouts");
      })
      .catch((error) => console.error(error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleDayChange = (e, dayIndex) => {
    const { name, value } = e.target;
    const daysCopy = [...formValues.days];
    daysCopy[dayIndex][name] = value;
    setFormValues({ ...formValues, days: daysCopy });
  };

  const handleExerciseChange = (e, dayIndex, exerciseIndex) => {
    const { name, value } = e.target;
    const daysCopy = [...formValues.days];
    daysCopy[dayIndex].exercises[exerciseIndex][name] = value;
    setFormValues({ ...formValues, days: daysCopy });
  };

  // Remove the last added day
  const handleRemoveDay = (dayIndex) => {
    const daysCopy = [...formValues.days];
    daysCopy.splice(dayIndex, 1);
    setFormValues({ ...formValues, days: daysCopy });
  };
  const handleRemoveExercise = (dayIndex, exerciseIndex) => {
    const daysCopy = [...formValues.days];
    daysCopy[dayIndex].exercises.splice(exerciseIndex, 1);
    setFormValues({ ...formValues, days: daysCopy });
  };

  return (
    <Layout>
      <div className="flex justify-center">
        <h1 className="text-4xl m-4 font-thin font-lato">Add workout</h1>
      </div>{" "}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="assignedTo">Assign to:</label>
          <select
            name="assignedTo"
            className="select select-ghost w-full max-w-xs m-4"
            value={formValues.assignedTo}
            onChange={handleChange}
          >
            <option disabled defaultValue={""}></option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.email}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="name"></label>
          <input
            type="text"
            name="name"
            className="input input-ghost w-full max-w-xs"
            placeholder={"Workout Name"}
            required={true}
            value={formValues.name}
            onChange={handleChange}
          />
        </div>
        {formValues.days.map((day, dayIndex) => (
          <div key={dayIndex} className="flex flex-wrap justify-center">
            <div className={"card bg-base-300 w-60 m-4"}>
              <h2>
                Day {dayIndex + 1}{" "}
                <button
                  className={`m-4 text-error`}
                  type="button"
                  onClick={() => handleRemoveDay(dayIndex)}
                >
                  <BsTrashFill />
                </button>
              </h2>

              <div>
                <label htmlFor={`day-${dayIndex}-day`}></label>
                <input
                  type="text"
                  name="day"
                  className="input input-ghost w-full max-w-xs"
                  placeholder={"Day"}
                  required={true}
                  value={day.day}
                  onChange={(e) => handleDayChange(e, dayIndex)}
                />
              </div>
              <div>
                <label htmlFor={`day-${dayIndex}-focus`}></label>
                <input
                  type="text"
                  name="focus"
                  className="input input-ghost w-full max-w-xs"
                  placeholder={"Focus"}
                  required={true}
                  value={day.focus}
                  onChange={(e) => handleDayChange(e, dayIndex)}
                />
              </div>
            </div>
            {day.exercises.map((exercise, exerciseIndex) => (
              <div key={exerciseIndex} className={"card bg-base-200 w-60 m-4"}>
                <h3>
                  Exercise {exerciseIndex + 1}{" "}
                  <button
                    className={`m-4 text-error`}
                    type="button"
                    onClick={() =>
                      handleRemoveExercise(dayIndex, exerciseIndex)
                    }
                  >
                    <BsTrashFill />
                  </button>
                </h3>

                <div>
                  <label
                    htmlFor={`day-${dayIndex}-exercise-${exerciseIndex}-name`}
                  ></label>
                  <input
                    type="text"
                    name="name"
                    className="input input-ghost w-full max-w-xs"
                    placeholder={"Exercise Name"}
                    required={true}
                    value={exercise.name}
                    onChange={(e) =>
                      handleExerciseChange(e, dayIndex, exerciseIndex)
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor={`day-${dayIndex}-exercise-${exerciseIndex}-sets`}
                  ></label>
                  <input
                    type="text"
                    name="sets"
                    className="input input-ghost w-full max-w-xs"
                    placeholder={"Sets"}
                    required={true}
                    value={exercise.sets}
                    onChange={(e) =>
                      handleExerciseChange(e, dayIndex, exerciseIndex)
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor={`day-${dayIndex}-exercise-${exerciseIndex}-reps`}
                  ></label>
                  <input
                    type="text"
                    name="reps"
                    className="input input-ghost w-full max-w-xs"
                    placeholder={"Reps"}
                    required={true}
                    value={exercise.reps}
                    onChange={(e) =>
                      handleExerciseChange(e, dayIndex, exerciseIndex)
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor={`day-${dayIndex}-exercise-${exerciseIndex}-cadence`}
                  ></label>
                  <input
                    type="text"
                    name="cadence"
                    className="input input-ghost w-full max-w-xs"
                    placeholder={"Cadence"}
                    value={exercise.cadence}
                    onChange={(e) =>
                      handleExerciseChange(e, dayIndex, exerciseIndex)
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor={`day-${dayIndex}-exercise-${exerciseIndex}-notes`}
                  ></label>
                  <input
                    type="text"
                    name="notes"
                    className="textarea textarea-ghost"
                    placeholder={"Notes"}
                    value={exercise.notes}
                    onChange={(e) =>
                      handleExerciseChange(e, dayIndex, exerciseIndex)
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor={`day-${dayIndex}-exercise-${exerciseIndex}-video`}
                  ></label>
                  <input
                    type="text"
                    name="video"
                    className="input input-ghost w-full max-w-xs"
                    placeholder={"Video"}
                    value={exercise.video}
                    onChange={(e) =>
                      handleExerciseChange(e, dayIndex, exerciseIndex)
                    }
                  />
                </div>
              </div>
            ))}
            <button
              className={`btn m-4`}
              type="button"
              onClick={() => {
                const daysCopy = [...formValues.days];
                daysCopy[dayIndex].exercises.push({
                  name: "",
                  sets: "",
                  reps: "",
                  cadence: "",
                  notes: "",
                  video: "",
                });
                setFormValues({ ...formValues, days: daysCopy });
              }}
            >
              Add Exercise
            </button>
          </div>
        ))}
        <button
          className={`btn m-4 `}
          type="button"
          onClick={() => {
            const daysCopy = [...formValues.days];
            daysCopy.push({
              day: "",
              focus: "",
              exercises: [
                {
                  name: "",
                  sets: "",
                  reps: "",
                  cadence: "",
                  notes: "",
                  video: "",
                },
              ],
            });
            setFormValues({ ...formValues, days: daysCopy });
          }}
        >
          Add Day
        </button>

        <button className={"btn bg-success text-success-content"} type="submit">
          Submit
        </button>
      </form>
    </Layout>
  );
}
