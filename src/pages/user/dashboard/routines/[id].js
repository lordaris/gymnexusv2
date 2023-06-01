import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Layout from "../../../../components/ui/userLayout";

function UserDashboard() {
  const [workout, setWorkout] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const token = Cookies.get("token");
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      axios
        .get(process.env.NEXT_PUBLIC_API_URL + `/workouts/list/by-id/${id}`, {
          headers: { Authorization: `${token}` },
        })
        .then((response) => setWorkout(response.data))
        .catch((error) => console.error(error));
    }
  }, [id, token]);
  if (!workout) {
    return <div>Loading...</div>;
  }

  const toggleDetails = (day) => {
    if (selectedDay === day) {
      setSelectedDay(null);
    } else {
      setSelectedDay(day);
    }
  };

  return (
    <Layout>
      <div className="text-center mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
    <h1 className="text-4xl font-lato py-4">
        {workout.name}
        </h1>
        <span className="text-xl font-lato py-4">
Additional notes: {workout.additionalNotes}</span>
      <ul className="space-y-6 py-4">
        {workout.days.map((day) => (
          <li key={day._id} className="bg-base-200 rounded-lg shadow-md">
              <h2
className="text-4xl font-lato cursor-pointer py-4 px-6 flex justify-between items-center hover:text-primary-focus"                onClick={() => toggleDetails(day)}
              >
                                <span className="">

                {day.day} ({day.focus})
                </span>

              </h2>
              <div className="divider"></div>

              {selectedDay === day && (
                <ul className="space-y-4">
                {day.exercises.map((exercise) => (
                    <li key={exercise._id}                       
                    className="text-xl font-lato px-6 py-4 flex flex-col"
                    >
                        <h3 className="text-3xl font-bebas-neue text-left">
                        {exercise.video ? (
                          <a
                            href={exercise.video}
                            className="text-blue-500 hover:text-blue-700"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {exercise.name}
                          </a>
                        ) : (
                          <span>{exercise.name}</span>
                        )}
                      </h3>
                      <p className="text-lg font-lato">
                        <span className="font-semibold">Sets:</span> {exercise.sets}
                      </p>
                      <p className="text-lg font-lato">
                        <span className="font-semibold">Reps:</span> {exercise.reps}
                      </p>
                      <p className="text-lg font-lato">
                        <span className="font-semibold">Cadence:</span> {exercise.cadence}
                      </p>
                      {exercise.notes && exercise.notes.trim().length > 0 && (
                          <p className="text-lg font-lato">
                          <span className="font-semibold">Notes:</span> {exercise.notes}
                        </p>
                      )}
                                              <div className="divider mt-4"></div>

                    </li>
                  ))}
                </ul>
              )}
          </li>
        ))}
      </ul>
    </div>
  </Layout>
  
  );
}

export default UserDashboard;
