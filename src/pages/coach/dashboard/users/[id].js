import CoachLayout from "../../../../components/ui/coachLayout";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { BsTrashFill } from "react-icons/bs";

export default function UserWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const [coachWorkouts, setCoachWorkouts] = useState([]);
  const [user, setUser] = useState({});
  const router = useRouter();
  const userId = router.query.id;
  const coachId = Cookies.get("user");

  const token = Cookies.get("token");

  const handleUnassign = (workoutId) => {
    const confirm = window.confirm(
      "¿Estás seguro de que quieres desasignar esta rutina?"
    );
    if (confirm) {
      axios
        .put(
          process.env.NEXT_PUBLIC_API_URL +
            `/workouts/unassign/${workoutId}/${userId}`,
          {},
          {
            headers: { Authorization: `${token}` },
          }
        )
        .then((response) => {
          // Update the list of assigned workouts
          setWorkouts((prevWorkouts) =>
            prevWorkouts.filter((workout) => workout._id !== workoutId)
          );
        })
        .catch((error) => console.error(error));
    }
  };

  useEffect(() => {
    axios
      .get(
        process.env.NEXT_PUBLIC_API_URL + `/workouts/list/assigned/${userId}`,
        {
          headers: { Authorization: `${token}` },
        }
      )
      .then((response) => {
        setWorkouts(response.data);
      })
      .catch((error) => console.error(error));
  }, [userId, token]);

  useEffect(() => {
    axios
      .get(process.env.NEXT_PUBLIC_API_URL + `/users/by-user-id/${userId}`, {
        headers: { Authorization: `${token}` },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => console.error(error));
  }, [userId, token]);

  return (
    <CoachLayout>
      <div>
        <h1 className={"text-4xl font-thin font-lato"}>User</h1>
        <p>{user.email}</p>
        <ul>
          Assigned workouts:
          {workouts.map((workout) => (
            <li key={workout._id} className={"m-4 hover:text-accent"}>
              <Link href={`/coach/dashboard/workouts/${workout._id}`}>
                {workout.name}
              </Link>
              <button
                className={"text-error"}
                onClick={() => handleUnassign(workout._id)}
              >
                <BsTrashFill />
              </button>
            </li>
          ))}
        </ul>
        <Link href={`/coach/dashboard/users/assign/${user._id}`}>
          <button className={"btn btn-primary"}>Assign workout</button>
        </Link>
      </div>
    </CoachLayout>
  );
}
