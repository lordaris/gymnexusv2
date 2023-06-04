import CoachLayout from "../../../../components/ui/coachLayout";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { BsTrashFill } from "react-icons/bs";
import { toast } from "react-toastify";

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
  const handleDeleteUser = (userId, token, router) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(process.env.NEXT_PUBLIC_API_URL + `/users/profile/${userId}`, {
          headers: { Authorization: `${token}` },
        })
        .then((response) => {
          toast.success("User deleted successfully", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          router.push("/coach/dashboard/users");
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
      <div className="text-center mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 ">
        <h1 className="text-lg lg:text-3xl font-lato py-4 ">
          User: {user.name ? user.name : user.email}{" "}
          <button
            className={"text-error hover:text-error-content ml-2 py-4"}
            onClick={() => handleDeleteUser(userId, token, router)}
          >
            <BsTrashFill />
          </button>
        </h1>
        <ul className="space-y-6 py-4">
          <li className="text-4xl font-lato py-4">Assigned workouts:</li>
          {workouts.map((workout) => (
            <li key={workout._id} className="bg-base-200 rounded-lg shadow-md">
              <div className="text-4xl font-lato cursor-pointer py-4 px-6 flex justify-between items-center hover:text-primary-focus">
                <Link
                  href={`/coach/dashboard/workouts/${workout._id}`}
                  className="hover:text-primary  text-3xl font-extrabold font-lato hover:text-primary-dark"
                >
                  {workout.name}
                </Link>
                <button
                  className={"text-error hover:text-error-content ml-2"}
                  onClick={() => handleUnassign(workout._id)}
                >
                  <BsTrashFill />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <Link href={`/coach/dashboard/users/assign/${user._id}`}>
          <button className={"btn btn-primary mt-4"}>Assign workout</button>
        </Link>
      </div>
    </CoachLayout>
  );
}
