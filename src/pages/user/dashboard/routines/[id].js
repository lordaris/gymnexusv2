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
      <div className="container mx-auto">
        <h1 className="text-5xl font-thin font-lato">{workout.name}</h1>
        <ul className="list-reset">
          {workout.days.map((day) => (
            <li key={day._id} className="my-8">
              <div className="border rounded-lg p-4 shadow max-w-md mx-auto">
                <h2
                  className="text-3xl font-extrabold font-lato cursor-pointer"
                  onClick={() => toggleDetails(day)}
                >
                  {day.day} ({day.focus})
                </h2>
                {selectedDay === day && (
                  <ul className="list-reset">
                    {day.exercises.map((exercise) => (
                      <li key={exercise._id} className="my-4">
                        <h3 className="text-3xl font-bold font-bebas-neue">
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
                        <p className="text-xl">
                          <span className="font-semibold">Sets:</span>{" "}
                          {exercise.sets}
                        </p>
                        <p className="text-xl">
                          <span className="font-semibold">Reps:</span>{" "}
                          {exercise.reps}
                        </p>
                        <p className="text-xl">
                          <span className="font-semibold">Cadence:</span>{" "}
                          {exercise.cadence}
                        </p>
                        {exercise.notes && exercise.notes.trim().length > 0 && (
                          <p className="text-xl">
                            <span className="font-semibold">Notes:</span>{" "}
                            {exercise.notes}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}

export default UserDashboard;
