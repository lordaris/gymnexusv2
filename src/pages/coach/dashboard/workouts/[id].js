import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Layout from "../../../../components/ui/coachLayout";
import Link from "next/link";
import { BsTrashFill } from "react-icons/bs";
import { FaEdit, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { PageHeader } from "../../../../components/ui/pageHeader";
import Layout from "../../../../components/ui/coachLayout";

function WorkoutDetail() {
  const [workout, setWorkout] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const token = Cookies.get("token");
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    const fetchWorkoutData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/workouts/list/by-id/${id}`,
          { headers: { Authorization: token } }
        );

        setWorkout(response.data);

        // Auto-expand first day if present
        if (response.data.days && response.data.days.length > 0) {
          setSelectedDay(response.data.days[0]);
        }
      } catch (error) {
        console.error("Error fetching workout:", error);
        toast.error("Failed to load workout");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkoutData();
  }, [id, token]);

  const handleDeleteDay = async (workoutId, dayId) => {
    if (!window.confirm("Are you sure you want to delete this day?")) {
      return;
    }

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/workouts/delete/${workoutId}/${dayId}`,
        { headers: { Authorization: token } }
      );

      toast.success("Day deleted successfully");

      // Update workout state
      setWorkout((prevState) => ({
        ...prevState,
        days: prevState.days.filter((day) => day._id !== dayId),
      }));

      // Reset selected day if it was deleted
      if (selectedDay && selectedDay._id === dayId) {
        setSelectedDay(null);
      }
    } catch (error) {
      console.error("Error deleting day:", error);
      toast.error("Failed to delete day");
    }
  };

  const handleDeleteExercise = async (workoutId, dayId, exerciseId) => {
    if (!window.confirm("Are you sure you want to delete this exercise?")) {
      return;
    }

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/workouts/delete/${workoutId}/${dayId}/${exerciseId}`,
        { headers: { Authorization: token } }
      );

      toast.success("Exercise deleted successfully");

      // Update workout state
      setWorkout((prevState) => {
        const updatedDays = prevState.days.map((day) => {
          if (day._id === dayId) {
            return {
              ...day,
              exercises: day.exercises.filter(
                (exercise) => exercise._id !== exerciseId
              ),
            };
          }
          return day;
        });

        return { ...prevState, days: updatedDays };
      });
    } catch (error) {
      console.error("Error deleting exercise:", error);
      toast.error("Failed to delete exercise");
    }
  };

  const handleDeleteWorkout = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this workout? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/workouts/delete/${id}`,
        { headers: { Authorization: token } }
      );

      toast.success("Workout deleted successfully");
      router.push("/coach/dashboard/workouts");
    } catch (error) {
      console.error("Error deleting workout:", error);
      toast.error("Failed to delete workout");
      setIsDeleting(false);
    }
  };

  const toggleDetails = (day) => {
    setSelectedDay(selectedDay && selectedDay._id === day._id ? null : day);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!workout) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-xl text-base-content/70">Workout not found</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => router.push("/coach/dashboard/workouts")}
          >
            Back to Workouts
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4">
        <PageHeader
          title={workout.name}
          action={
            <Button
              variant="error"
              size="md"
              onClick={handleDeleteWorkout}
              disabled={isDeleting}
              className="flex items-center gap-2"
            >
              <BsTrashFill /> {isDeleting ? "Deleting..." : "Delete Workout"}
            </Button>
          }
        />

        {workout.additionalNotes && (
          <Card className="mb-8 p-4">
            <h2 className="text-xl font-medium mb-2">Notes</h2>
            <p className="text-base-content/80">{workout.additionalNotes}</p>
          </Card>
        )}

        {workout.days.length === 0 ? (
          <div className="text-center py-8 bg-base-200 rounded-lg">
            <p className="text-xl mb-4">No training days added yet</p>
            <Link href={`/coach/dashboard/workouts/new/day/${workout._id}`}>
              <Button variant="primary" size="lg">
                Add Your First Day
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {workout.days.map((day) => (
              <Card key={day._id} className="overflow-hidden">
                <div
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-base-300 transition-colors"
                  onClick={() => toggleDetails(day)}
                >
                  <div>
                    <h2 className="text-2xl font-medium">
                      {day.day}{" "}
                      <span className="text-base-content/60">
                        ({day.focus})
                      </span>
                    </h2>
                    <p className="text-sm text-base-content/60">
                      {day.exercises.length} exercise
                      {day.exercises.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/coach/dashboard/workouts/new/exercise/${workout._id}/${day._id}`}
                    >
                      <Button
                        variant="success"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaPlus size={12} /> Add Exercise
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDay(id, day._id);
                      }}
                    >
                      <BsTrashFill size={16} />
                    </Button>
                  </div>
                </div>

                {selectedDay && selectedDay._id === day._id && (
                  <div className="bg-base-200 p-4">
                    {day.exercises.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-base-content/60 mb-3">
                          No exercises added yet
                        </p>
                        <Link
                          href={`/coach/dashboard/workouts/new/exercise/${workout._id}/${day._id}`}
                        >
                          <Button variant="primary" size="sm">
                            Add Exercise
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {day.exercises.map((exercise) => (
                          <div
                            key={exercise._id}
                            className="bg-base-100 p-4 rounded-lg shadow-sm"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="text-xl font-medium">
                                {exercise.video ? (
                                  <a
                                    href={exercise.video}
                                    className="text-primary hover:underline flex items-center gap-1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {exercise.name}{" "}
                                    <span className="text-xs">(video)</span>
                                  </a>
                                ) : (
                                  exercise.name
                                )}
                              </h3>

                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/coach/dashboard/workouts/update/${id}/${day._id}/${exercise._id}`}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-secondary"
                                  >
                                    <FaEdit size={16} />
                                  </Button>
                                </Link>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-error"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteExercise(
                                      id,
                                      day._id,
                                      exercise._id
                                    );
                                  }}
                                >
                                  <BsTrashFill size={16} />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-3">
                              <div>
                                <span className="text-sm text-base-content/60">
                                  Sets:
                                </span>{" "}
                                <span className="font-medium">
                                  {exercise.sets}
                                </span>
                              </div>

                              <div>
                                <span className="text-sm text-base-content/60">
                                  Reps:
                                </span>{" "}
                                <span className="font-medium">
                                  {exercise.reps}
                                </span>
                              </div>

                              {exercise.cadence && (
                                <div>
                                  <span className="text-sm text-base-content/60">
                                    Cadence:
                                  </span>{" "}
                                  <span className="font-medium">
                                    {exercise.cadence}
                                  </span>
                                </div>
                              )}
                            </div>

                            {exercise.notes && (
                              <div className="mt-2 text-sm">
                                <span className="text-base-content/60">
                                  Notes:
                                </span>{" "}
                                <span>{exercise.notes}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Link href={`/coach/dashboard/workouts/new/day/${workout._id}`}>
            <Button
              variant="primary"
              size="lg"
              className="flex items-center gap-2"
            >
              <FaPlus /> Add New Day
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default WorkoutDetail;
