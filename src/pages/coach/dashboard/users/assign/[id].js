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
      <div className="text-center mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-lato py-4">Assign Workout</h2>
        <div className="overflow-x-auto">
          <ul className="space-y-6 py-4">
            {coachWorkouts.map((workout) => (
              <li key={workout.id} className="bg-base-200 rounded-lg shadow-md">
                <div className="text-4xl font-lato cursor-pointer py-4 px-6 flex justify-between items-center hover:text-primary-focus">
                  <Link
                    href={`/coach/dashboard/workouts/${workout._id}`}
                    className="hover:text-primary text-3xl font-extrabold font-lato hover:text-primary-dark"
                  >
                    {workout.name }
                  </Link>
                  <button
                    className="px-4 text-primary hover:text-primary-focus font-extrabold"
                    onClick={() => handleAssign(workout._id)}
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </CoachLayout>
  );
}
