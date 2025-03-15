import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Cookie from "js-cookie";
import { toast } from "react-toastify";
import { Card } from "../../../../../../components/ui/card";
import { PageHeader } from "../../../../../../components/ui/pageHeader";
import { Button } from "../../../../../../components/ui/button";
import { Input } from "../../../../../../components/ui/input";
import { TextArea } from "../../../../../../components/ui/textarea";
import Layout from "../../../../../../components/ui/coachLayout";
import { Select } from "../../../../../../components/ui/select";

export default function AddWorkout() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const coachId = Cookie.get("user");
  const token = Cookie.get("token");
  const router = useRouter();

  const [formValues, setFormValues] = useState({
    assignedTo: "",
    coach: coachId,
    name: "",
    additionalNotes: "",
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_API_URL + `/users/by-coach/${coachId}`,
          { headers: { Authorization: `${token}` } }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("Failed to load clients");
      }
    };

    fetchUsers();
  }, [coachId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formValues.name.trim()) {
      toast.error("Workout name is required");
      return;
    }

    // Validate days
    for (const day of formValues.days) {
      if (!day.day.trim() || !day.focus.trim()) {
        toast.error("All days must have a name and focus");
        return;
      }

      // Validate exercises
      for (const exercise of day.exercises) {
        if (
          !exercise.name.trim() ||
          !exercise.sets.trim() ||
          !exercise.reps.trim()
        ) {
          toast.error("All exercises must have a name, sets, and reps");
          return;
        }
      }
    }

    try {
      setIsLoading(true);
      await axios.post(
        process.env.NEXT_PUBLIC_API_URL + `/workouts/create`,
        formValues,
        { headers: { Authorization: `${token}` } }
      );

      toast.success("Workout created successfully");
      router.push("/coach/dashboard/workouts");
    } catch (error) {
      console.error("Failed to create workout:", error);
      toast.error("Failed to create workout");
    } finally {
      setIsLoading(false);
    }
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

  const handleRemoveDay = (dayIndex) => {
    if (formValues.days.length === 1) {
      toast.warning("You need at least one day in your workout");
      return;
    }

    const daysCopy = [...formValues.days];
    daysCopy.splice(dayIndex, 1);
    setFormValues({ ...formValues, days: daysCopy });
  };

  const handleRemoveExercise = (dayIndex, exerciseIndex) => {
    if (formValues.days[dayIndex].exercises.length === 1) {
      toast.warning("Each day needs at least one exercise");
      return;
    }

    const daysCopy = [...formValues.days];
    daysCopy[dayIndex].exercises.splice(exerciseIndex, 1);
    setFormValues({ ...formValues, days: daysCopy });
  };

  const addExercise = (dayIndex) => {
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
  };

  const addDay = () => {
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
  };

  return (
    <Layout>
      {" "}
      <div className="max-w-6xl mx-auto px-4">
        <PageHeader
          title="Create New Workout"
          subtitle="Design a comprehensive training program"
        />

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Workout Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Workout Name"
                  label="Workout Name"
                  required={true}
                  value={formValues.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Select
                  id="assignedTo"
                  name="assignedTo"
                  label="Assign to Client"
                  value={formValues.assignedTo}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "Select a client" },
                    ...users.map((user) => ({
                      value: user._id,
                      label: user.name
                        ? `${user.name} ${user.lastName || ""}`
                        : user.email,
                    })),
                  ]}
                />
              </div>
            </div>

            <div className="mt-4">
              <TextArea
                id="additionalNotes"
                name="additionalNotes"
                placeholder="Additional Notes"
                label="Additional Notes"
                rows={3}
                value={formValues.additionalNotes}
                onChange={handleChange}
              />
            </div>
          </Card>

          {formValues.days.map((day, dayIndex) => (
            <Card key={dayIndex} className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Day {dayIndex + 1}</h2>
                <Button
                  type="button"
                  variant="error"
                  size="sm"
                  onClick={() => handleRemoveDay(dayIndex)}
                >
                  Remove Day
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Input
                  id={`day-${dayIndex}-day`}
                  name="day"
                  type="text"
                  placeholder="Day Name (e.g., Monday, Day 1)"
                  label="Day Name"
                  required={true}
                  value={day.day}
                  onChange={(e) => handleDayChange(e, dayIndex)}
                />

                <Input
                  id={`day-${dayIndex}-focus`}
                  name="focus"
                  type="text"
                  placeholder="Focus (e.g., Upper Body, Cardio)"
                  label="Training Focus"
                  required={true}
                  value={day.focus}
                  onChange={(e) => handleDayChange(e, dayIndex)}
                />
              </div>

              <h3 className="text-lg font-medium mb-3">Exercises</h3>

              {day.exercises.map((exercise, exerciseIndex) => (
                <div
                  key={exerciseIndex}
                  className="bg-base-200 p-4 rounded-lg mb-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">
                      Exercise {exerciseIndex + 1}
                    </h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-error"
                      onClick={() =>
                        handleRemoveExercise(dayIndex, exerciseIndex)
                      }
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <Input
                      id={`day-${dayIndex}-exercise-${exerciseIndex}-name`}
                      name="name"
                      type="text"
                      placeholder="Exercise Name"
                      label="Exercise Name"
                      required={true}
                      value={exercise.name}
                      onChange={(e) =>
                        handleExerciseChange(e, dayIndex, exerciseIndex)
                      }
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        id={`day-${dayIndex}-exercise-${exerciseIndex}-sets`}
                        name="sets"
                        type="text"
                        placeholder="Sets"
                        label="Sets"
                        required={true}
                        value={exercise.sets}
                        onChange={(e) =>
                          handleExerciseChange(e, dayIndex, exerciseIndex)
                        }
                      />

                      <Input
                        id={`day-${dayIndex}-exercise-${exerciseIndex}-reps`}
                        name="reps"
                        type="text"
                        placeholder="Reps"
                        label="Reps"
                        required={true}
                        value={exercise.reps}
                        onChange={(e) =>
                          handleExerciseChange(e, dayIndex, exerciseIndex)
                        }
                      />

                      <Input
                        id={`day-${dayIndex}-exercise-${exerciseIndex}-cadence`}
                        name="cadence"
                        type="text"
                        placeholder="Cadence (e.g. 2-0-2)"
                        label="Cadence"
                        value={exercise.cadence}
                        onChange={(e) =>
                          handleExerciseChange(e, dayIndex, exerciseIndex)
                        }
                      />
                    </div>

                    <TextArea
                      id={`day-${dayIndex}-exercise-${exerciseIndex}-notes`}
                      name="notes"
                      placeholder="Exercise Notes"
                      label="Notes"
                      value={exercise.notes}
                      onChange={(e) =>
                        handleExerciseChange(e, dayIndex, exerciseIndex)
                      }
                    />

                    <Input
                      id={`day-${dayIndex}-exercise-${exerciseIndex}-video`}
                      name="video"
                      type="url"
                      placeholder="Video URL"
                      label="Video Link"
                      value={exercise.video}
                      onChange={(e) =>
                        handleExerciseChange(e, dayIndex, exerciseIndex)
                      }
                    />
                  </div>
                </div>
              ))}

              <div className="mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => addExercise(dayIndex)}
                >
                  Add Exercise
                </Button>
              </div>
            </Card>
          ))}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={addDay}
            >
              Add Day
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Workout"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
