import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Cookie from "js-cookie";
import Layout from "../../../../../../components/ui/coachLayout";
import { toast } from "react-toastify";
import { Button } from "../../../../../../components/ui/button";
import { Input } from "../../../../../../components/ui/input";
import { PageHeader } from "../../../../../../components/ui/pageHeader";
import { Card } from "../../../../../../components/ui/card";

export default function NewDayForm() {
  const [formValues, setFormValues] = useState({
    day: "",
    focus: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const token = Cookie.get("token");
  const { workoutId } = router.query;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formValues.day.trim()) {
      toast.error("Day name is required");
      return;
    }

    if (!formValues.focus.trim()) {
      toast.error("Focus is required");
      return;
    }

    try {
      setIsSubmitting(true);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workouts/create/${workoutId}`,
        formValues,
        { headers: { Authorization: token } }
      );

      toast.success("Day added successfully");
      router.push(`/coach/dashboard/workouts/${workoutId}`);
    } catch (error) {
      console.error("Error adding day:", error);
      toast.error("Failed to add day");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4">
        <PageHeader
          title="Add New Day"
          subtitle="Create a new training day for your workout"
        />

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="day"
              name="day"
              type="text"
              label="Day Name"
              placeholder="Day (e.g., Monday, Day 1)"
              required={true}
              value={formValues.day}
              onChange={handleChange}
            />

            <Input
              id="focus"
              name="focus"
              type="text"
              label="Training Focus"
              placeholder="Focus (e.g., Upper Body, Cardio)"
              required={true}
              value={formValues.focus}
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
                {isSubmitting ? "Adding..." : "Add Day"}
              </Button>
            </div>
          </form>
        </Card>

        <div className="text-center mt-6 text-sm text-base-content/70">
          <p>After adding a day, you'll be able to add exercises to it.</p>
        </div>
      </div>
    </Layout>
  );
}
