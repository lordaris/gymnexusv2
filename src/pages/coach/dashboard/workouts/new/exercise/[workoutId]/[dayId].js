import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../../../../components/ui/coachLayout";
import Cookie from "js-cookie";
import { toast } from "react-toastify";
import axios from "axios";
import { Button } from "../../../../../../../components/ui/button";
import { Input } from "../../../../../../../components/ui/input";
import { TextArea } from "../../../../../../../components/ui/textarea";
import { PageHeader } from "../../../../../../../components/ui/pageHeader";
import { Card } from "../../../../../../../components/ui/card";

function AddExercise() {
  const [workout, setWorkout] = useState(null);
  const [day, setDay] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    sets: "",
    reps: "",
    cadence: "",
    notes: "",
    video: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const token = Cookie.get("token");
  const { workoutId, dayId } = router.query;

  useEffect(() => {
    if (!workoutId || !dayId) return;

    const fetchWorkoutData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/workouts/list/by-id/${workoutId}`,
          { headers: { Authorization: token } }
        );

        const workoutData = response.data;
        const dayData = workoutData.days.find((d) => d._id === dayId);

        if (!dayData) {
          toast.error("Day not found");
          router.push(`/coach/dashboard/workouts/${workoutId}`);
          return;
        }

        setWorkout(workoutData);
        setDay(dayData);
      } catch (error) {
        console.error("Error fetching workout data:", error);
        toast.error("Failed to load workout data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkoutData();
  }, [workoutId, dayId, token, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formValues.name.trim()) {
      toast.error("Exercise name is required");
      return;
    }

    if (!formValues.sets.trim()) {
      toast.error("Sets are required");
      return;
    }

    if (!formValues.reps.trim()) {
      toast.error("Reps are required");
      return;
    }

    try {
      setIsSubmitting(true);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workouts/create/${workoutId}/${dayId}`,
        formValues,
        { headers: { Authorization: token } }
      );

      toast.success("Exercise added successfully");
      router.push(`/coach/dashboard/workouts/${workoutId}`);
    } catch (error) {
      console.error("Error adding exercise:", error);
      toast.error("Failed to add exercise");
    } finally {
      setIsSubmitting(false);
    }
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

  if (!workout || !day) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-base-content/70">Workout or day not found</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => router.push(`/coach/dashboard/workouts`)}
          >
            Back to Workouts
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4">
        <PageHeader
          title="Add New Exercise"
          subtitle={`Day: ${day.day} - ${day.focus}`}
        />

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control w-full">
              <Input
                id="name"
                name="name"
                type="text"
                label="Exercise Name"
                placeholder="Exercise Name"
                required={true}
                value={formValues.name}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                id="sets"
                name="sets"
                type="text"
                label="Sets"
                placeholder="Sets"
                required={true}
                value={formValues.sets}
                onChange={handleChange}
              />

              <Input
                id="reps"
                name="reps"
                type="text"
                label="Reps"
                placeholder="Reps"
                required={true}
                value={formValues.reps}
                onChange={handleChange}
              />

              <Input
                id="cadence"
                name="cadence"
                type="text"
                label="Cadence"
                placeholder="Cadence (e.g. 2-0-2)"
                value={formValues.cadence}
                onChange={handleChange}
              />
            </div>

            <TextArea
              id="notes"
              name="notes"
              label="Notes"
              placeholder="Exercise Notes"
              value={formValues.notes}
              onChange={handleChange}
              rows={3}
            />

            <Input
              id="video"
              name="video"
              type="url"
              label="Video Link"
              placeholder="Video URL"
              value={formValues.video}
              onChange={handleChange}
            />

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  router.push(`/coach/dashboard/workouts/${workoutId}`)
                }
              >
                Cancel
              </Button>

              <Button type="submit" variant="success" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Exercise"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}

export default AddExercise;
