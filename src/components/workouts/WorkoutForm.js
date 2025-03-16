// src/components/workouts/WorkoutForm.js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { TextArea } from "../ui/textarea";
import { Select } from "../ui/select";
import { toast } from "react-toastify";
import { FaPlus, FaTrash } from "react-icons/fa";
import { workoutsAPI, usersAPI } from "../../utils/apiClient";
import { useAuth } from "../../contexts/AuthContext";
import { handleError } from "../../utils/errorHandling";

export const WorkoutForm = ({ initialData = null }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    assignedTo: [],
    coach: user?.id || "",
    additionalNotes: "",
    days: [createEmptyDay()],
  });

  // Load clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const response = await usersAPI.getByCoach(user?.id);
        setClients(response.data || []);
      } catch (error) {
        handleError(error, {
          context: "fetching clients",
          defaultMessage: "Failed to load clients",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchClients();
    }
  }, [user]);

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        assignedTo: initialData.assignedTo || [],
      });
    }
  }, [initialData]);

  // Create empty objects for form
  function createEmptyDay() {
    return {
      day: "",
      focus: "",
      exercises: [createEmptyExercise()],
    };
  }

  function createEmptyExercise() {
    return {
      name: "",
      sets: "",
      reps: "",
      cadence: "",
      notes: "",
      video: "",
    };
  }

  // Form change handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClientChange = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData({ ...formData, assignedTo: value });
  };

  const handleDayChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDays = [...formData.days];
    updatedDays[index][name] = value;
    setFormData({ ...formData, days: updatedDays });
  };

  const handleExerciseChange = (dayIndex, exerciseIndex, e) => {
    const { name, value } = e.target;
    const updatedDays = [...formData.days];
    updatedDays[dayIndex].exercises[exerciseIndex][name] = value;
    setFormData({ ...formData, days: updatedDays });
  };

  // Add/remove handlers
  const addDay = () => {
    setFormData({
      ...formData,
      days: [...formData.days, createEmptyDay()],
    });
  };

  const removeDay = (index) => {
    if (formData.days.length <= 1) {
      toast.warning("You need at least one day in your workout");
      return;
    }

    const updatedDays = [...formData.days];
    updatedDays.splice(index, 1);
    setFormData({ ...formData, days: updatedDays });
  };

  const addExercise = (dayIndex) => {
    const updatedDays = [...formData.days];
    updatedDays[dayIndex].exercises.push(createEmptyExercise());
    setFormData({ ...formData, days: updatedDays });
  };

  const removeExercise = (dayIndex, exerciseIndex) => {
    if (formData.days[dayIndex].exercises.length <= 1) {
      toast.warning("Day must have at least one exercise");
      return;
    }

    const updatedDays = [...formData.days];
    updatedDays[dayIndex].exercises.splice(exerciseIndex, 1);
    setFormData({ ...formData, days: updatedDays });
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Workout name is required");
      return;
    }

    // Validate days
    for (const [dayIndex, day] of formData.days.entries()) {
      if (!day.day.trim()) {
        toast.error(`Day ${dayIndex + 1} needs a name`);
        return;
      }

      if (!day.focus.trim()) {
        toast.error(`Day ${dayIndex + 1} needs a focus`);
        return;
      }

      // Validate exercises
      for (const [exerciseIndex, exercise] of day.exercises.entries()) {
        if (!exercise.name.trim()) {
          toast.error(
            `Exercise ${exerciseIndex + 1} on day ${dayIndex + 1} needs a name`
          );
          return;
        }

        if (!exercise.sets) {
          toast.error(
            `Exercise ${exerciseIndex + 1} on day ${dayIndex + 1} needs sets`
          );
          return;
        }

        if (!exercise.reps) {
          toast.error(
            `Exercise ${exerciseIndex + 1} on day ${dayIndex + 1} needs reps`
          );
          return;
        }
      }
    }

    try {
      setIsSaving(true);

      if (initialData && initialData._id) {
        // Update existing workout logic would go here
        // This would require implementing a proper update endpoint
        toast.info("Workout updates not implemented yet");
      } else {
        // Create new workout
        const response = await workoutsAPI.create(formData);
        toast.success("Workout created successfully");
        router.push(`/coach/dashboard/workouts/${response.data._id}`);
      }
    } catch (error) {
      handleError(error, {
        context: "saving workout",
        defaultMessage: "Failed to save workout",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Workout Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <Input
            id="name"
            name="name"
            type="text"
            label="Workout Name"
            placeholder="Workout Name"
            required={true}
            value={formData.name}
            onChange={handleChange}
          />

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Assign to Clients</span>
            </label>
            <select
              name="assignedTo"
              multiple
              className="select select-bordered w-full h-24"
              onChange={handleClientChange}
              value={formData.assignedTo}
            >
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name
                    ? `${client.name} ${client.lastName || ""}`
                    : client.email}
                </option>
              ))}
            </select>
            <label className="label">
              <span className="label-text-alt">
                Hold Ctrl/Cmd to select multiple
              </span>
            </label>
          </div>
        </div>

        <TextArea
          id="additionalNotes"
          name="additionalNotes"
          label="Additional Notes"
          placeholder="Enter any additional information about this workout program"
          value={formData.additionalNotes}
          onChange={handleChange}
          rows={3}
        />
      </Card>

      {formData.days.map((day, dayIndex) => (
        <Card key={dayIndex} className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Day {dayIndex + 1}</h2>
            <Button
              type="button"
              variant="error"
              size="sm"
              onClick={() => removeDay(dayIndex)}
              className="flex items-center gap-1"
            >
              <FaTrash size={12} /> Remove Day
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Input
              id={`day-${dayIndex}-name`}
              name="day"
              type="text"
              label="Day Name"
              placeholder="e.g., Monday, Day 1, Upper Body Day"
              required={true}
              value={day.day}
              onChange={(e) => handleDayChange(dayIndex, e)}
            />

            <Input
              id={`day-${dayIndex}-focus`}
              name="focus"
              type="text"
              label="Training Focus"
              placeholder="e.g., Upper Body, Cardio, Strength"
              required={true}
              value={day.focus}
              onChange={(e) => handleDayChange(dayIndex, e)}
            />
          </div>

          <h3 className="text-lg font-medium mb-4">Exercises</h3>

          {day.exercises.map((exercise, exerciseIndex) => (
            <div
              key={exerciseIndex}
              className="bg-base-200 p-4 rounded-lg mb-4"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Exercise {exerciseIndex + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-error"
                  onClick={() => removeExercise(dayIndex, exerciseIndex)}
                >
                  <FaTrash size={14} />
                </Button>
              </div>

              <div className="space-y-4">
                <Input
                  id={`day-${dayIndex}-exercise-${exerciseIndex}-name`}
                  name="name"
                  type="text"
                  label="Exercise Name"
                  placeholder="e.g., Bench Press, Squats"
                  required={true}
                  value={exercise.name}
                  onChange={(e) =>
                    handleExerciseChange(dayIndex, exerciseIndex, e)
                  }
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    id={`day-${dayIndex}-exercise-${exerciseIndex}-sets`}
                    name="sets"
                    type="text"
                    label="Sets"
                    placeholder="e.g., 3, 4-5"
                    required={true}
                    value={exercise.sets}
                    onChange={(e) =>
                      handleExerciseChange(dayIndex, exerciseIndex, e)
                    }
                  />

                  <Input
                    id={`day-${dayIndex}-exercise-${exerciseIndex}-reps`}
                    name="reps"
                    type="text"
                    label="Reps"
                    placeholder="e.g., 10, 8-12"
                    required={true}
                    value={exercise.reps}
                    onChange={(e) =>
                      handleExerciseChange(dayIndex, exerciseIndex, e)
                    }
                  />
                  <Input
                    id={`day-${dayIndex}-exercise-${exerciseIndex}-cadence`}
                    name="cadence"
                    type="text"
                    label="Cadence"
                    placeholder="e.g., 2-0-2"
                    value={exercise.cadence}
                    onChange={(e) =>
                      handleExerciseChange(dayIndex, exerciseIndex, e)
                    }
                  />
                </div>

                <TextArea
                  id={`day-${dayIndex}-exercise-${exerciseIndex}-notes`}
                  name="notes"
                  label="Notes"
                  placeholder="Exercise instructions or notes"
                  value={exercise.notes}
                  onChange={(e) =>
                    handleExerciseChange(dayIndex, exerciseIndex, e)
                  }
                  rows={2}
                />

                <Input
                  id={`day-${dayIndex}-exercise-${exerciseIndex}-video`}
                  name="video"
                  type="url"
                  label="Video Link"
                  placeholder="URL to demonstration video"
                  value={exercise.video}
                  onChange={(e) =>
                    handleExerciseChange(dayIndex, exerciseIndex, e)
                  }
                />
              </div>
            </div>
          ))}

          <div className="mt-4">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => addExercise(dayIndex)}
              className="flex items-center gap-1"
            >
              <FaPlus size={12} /> Add Exercise
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
          className="flex items-center gap-2"
        >
          <FaPlus /> Add Day
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSaving}
          className="min-w-[150px]"
        >
          {isSaving
            ? "Saving..."
            : initialData
            ? "Update Workout"
            : "Create Workout"}
        </Button>
      </div>
    </form>
  );
};

export default WorkoutForm;
