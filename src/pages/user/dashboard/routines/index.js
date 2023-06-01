import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import Layout from "../../../../components/ui/userLayout";
import Image from "next/image";

export const getRoutines = async () => {
  const token = Cookies.get("token");
  const userId = Cookies.get("user");
  const response = await axios.get(
    process.env.NEXT_PUBLIC_API_URL + `/workouts/list/assigned/${userId}`,
    {
      headers: {
        Authorization: `${token}`,
      },
    }
  );
  return response.data;
};

export default function RoutinesPage() {
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    const fetchRoutines = async () => {
      const routines = await getRoutines();
      setRoutines(routines);
    };
    fetchRoutines();
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      // Use the router to redirect to the appropriate dashboard
      const role = Cookies.get("role");
      if (role !== "ATHLETE") {
        router.push("/coach/dashboard");
      }
    }
  }, []);

  return (
    <Layout>
      <div>
      <h1 className="text-4xl font-lato py-4">
Workouts</h1>
        {routines.length === 0 ? (
      <div className="text-center mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-lato py-4">
              No Workouts Available
            </h1>
            <Image
              src="/lunges.png"
              alt="empty-state"
              width={500}
              height={500}
              className="opacity-50 p-4"
            />
            <p className="opacity-50 text-4xl">
              There are no available workouts yet
            </p>
          </div>
        ) : (
      <div className="text-center mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <ul className="list-reset">
              {routines.map((workout) => (
                <li key={workout._id} className="bg-base-200 rounded-lg shadow-md">
                  <div 
                className="text-4xl font-lato cursor-pointer py-4 px-6 flex justify-center items-center hover:text-primary-focus"
                  >
                    <Link href={`/user/dashboard/routines/${workout._id}`}>
                      <span>{workout.name}</span>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
}
