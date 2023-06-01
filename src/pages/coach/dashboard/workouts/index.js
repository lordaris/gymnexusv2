import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import Link from "next/link";
import LogoutButton from "../../../../components/ui/logoutButton";
import Layout from "../../../../components/ui/coachLayout";

export default function RoutinesPage() {
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    const fetchRoutines = async () => {
      const token = Cookies.get("token");
      const coachId = Cookies.get("user");
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + `/workouts/list/coach/${coachId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      const data = response.data;
      console.log(data);
      if (data && data.length > 0) {
        setRoutines(data);
      } else {
        setRoutines([]);
      }
    };
    fetchRoutines();
  }, []);

  return (
    <Layout>
    <div>
      <h1 className="text-5xl m-4 font-thin font-lato">Workouts</h1>
    </div>
  
    <div className="overflow-x-auto">
      <ul className="list-reset">
        {routines.map((workout) => (
          <li key={workout._id} className="my-4 px-4">
            <div className="border rounded-lg p-4 shadow max-w-md mx-auto">
              <Link
                href={`/coach/dashboard/workouts/${workout._id}`}
                className="hover:text-primary text-3xl font-extrabold font-lato hover:text-primary-dark"
              >
                {workout.name}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </Layout>
  
  );
}
