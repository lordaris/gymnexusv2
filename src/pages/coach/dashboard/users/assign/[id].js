import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import CoachLayout from "../../../../../components/ui/coachLayout";

export default function AssignWorkout() {
  const [coachWorkouts, setCoachWorkouts] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const coachId = Cookies.get("user");
  const token = Cookies.get("token");
  const router = useRouter();
  const userId = router.query.id;
  const handleAssign = (workoutId) => {
    axios
      .put(
        process.env.NEXT_PUBLIC_API_URL +
          `/workouts/assign/${workoutId}/${userId}`,
        {},
        {
          headers: { Authorization: `${token}` },
        }
      )
      .then((response) => {
        // Update the list of assigned workouts
        setWorkouts((prevWorkouts) => [...prevWorkouts, response.data.workout]);

        alert(`${response.data.message}`);
        router.back();
      })
      .catch(() => alert("User already assigned to this workout"));
  };

  useEffect(() => {
    axios
      .get(
        process.env.NEXT_PUBLIC_API_URL + `/workouts/list/coach/${coachId}`,
        {
          headers: { Authorization: `${token}` },
        }
      )
      .then((response) => {
        setCoachWorkouts(response.data);
      })
      .catch((error) => console.error(error));
  }, [coachId, token]);

  return (
    <CoachLayout>
      <div>
        <h2 className={"text-4xl font-thin font-lato"}>Assign workout</h2>
        <ul>
          {coachWorkouts.map((workout) => (
            <li key={workout.id}>
              <Link href={`/coach/dashboard/workouts/${workout._id}`}>
                {workout.name}
                {"    "}
              </Link>
              <button
                className={"text-primary font-extrabold"}
                onClick={() => handleAssign(workout._id)}
              >
                Add
              </button>
            </li>
          ))}
        </ul>{" "}
      </div>
    </CoachLayout>
  );
}
