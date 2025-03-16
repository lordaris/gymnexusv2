import { useState } from "react";
import Layout from "../../../../../components/ui/userLayout";
import axios from "axios";
import Cookies from "js-cookie";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { Card } from "../../../../../components/ui/card";
import { PageHeader } from "../../../../../components/ui/pageHeader";

const currentDate = format(new Date(), "yyyy-MM-dd");

export default function AddMetricsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: currentDate,
    weight: "",
    height: "",
    neck: "",
    chest: "",
    waist: "",
    hips: "",
    thighs: "",
    biceps: "",
    benchPressRm: "",
    sitUpRm: "",
    deadLiftRm: "",
  });

  const user = Cookies.get("user");
  const token = Cookies.get("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Make API request to save the metrics data
      await axios.post(
        process.env.NEXT_PUBLIC_API_URL + `/users/profile/metrics/${user}`,
        formData,
        { headers: { Authorization: `${token}` } }
      );

      // Reset the form
      setFormData({
        date: currentDate,
        weight: "",
        height: "",
        neck: "",
        chest: "",
        waist: "",
        hips: "",
        thighs: "",
        biceps: "",
        benchPressRm: "",
        sitUpRm: "",
        deadLiftRm: "",
      });

      toast.success("Metrics added successfully");
    } catch (error) {
      console.error("Error adding metrics:", error);
      toast.error("Failed to add metrics");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4">
        <PageHeader
          title="Add New Metrics"
          subtitle="Track your progress by recording your latest measurements"
        />

        <Card className="p-6 mb-6">
          <div className="text-base-content/80 mb-6">
            <p className="mb-2">Feel free to add any metrics you like.</p>
            <p>
              If you add{" "}
              <span className="text-primary font-medium">
                weight, height, neck, waist, and hips
              </span>
              , the app will calculate your{" "}
              <span className="text-primary-focus font-medium">
                BMI and body fat percentage
              </span>{" "}
              and add that information to the corresponding chart.
            </p>
            <p className="mt-2 text-sm">
              You need to update your biological gender on your profile to make
              the body fat percentage calculations work correctly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Body Measurements</h3>

                <div className="space-y-4">
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    step="0.1"
                    label="Weight (kg)"
                    placeholder="Enter weight in kg"
                    value={formData.weight}
                    onChange={handleChange}
                  />

                  <Input
                    id="height"
                    name="height"
                    type="number"
                    step="0.1"
                    label="Height (cm)"
                    placeholder="Enter height in cm"
                    value={formData.height}
                    onChange={handleChange}
                  />

                  <Input
                    id="neck"
                    name="neck"
                    type="number"
                    step="0.1"
                    label="Neck (cm)"
                    placeholder="Enter neck circumference"
                    value={formData.neck}
                    onChange={handleChange}
                  />

                  <Input
                    id="chest"
                    name="chest"
                    type="number"
                    step="0.1"
                    label="Chest (cm)"
                    placeholder="Enter chest circumference"
                    value={formData.chest}
                    onChange={handleChange}
                  />

                  <Input
                    id="waist"
                    name="waist"
                    type="number"
                    step="0.1"
                    label="Waist (cm)"
                    placeholder="Enter waist circumference"
                    value={formData.waist}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">
                  Additional Measurements
                </h3>

                <div className="space-y-4">
                  <Input
                    id="hips"
                    name="hips"
                    type="number"
                    step="0.1"
                    label="Hips (cm)"
                    placeholder="Enter hips circumference"
                    value={formData.hips}
                    onChange={handleChange}
                  />

                  <Input
                    id="thighs"
                    name="thighs"
                    type="number"
                    step="0.1"
                    label="Thighs (cm)"
                    placeholder="Enter thigh circumference"
                    value={formData.thighs}
                    onChange={handleChange}
                  />

                  <Input
                    id="biceps"
                    name="biceps"
                    type="number"
                    step="0.1"
                    label="Biceps (cm)"
                    placeholder="Enter biceps circumference"
                    value={formData.biceps}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="bg-base-300 p-6 rounded-lg mt-6">
              <h3 className="text-lg font-medium mb-4">
                Strength Measurements
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  id="benchPressRm"
                  name="benchPressRm"
                  type="number"
                  step="0.5"
                  label="Bench Press Max (kg)"
                  placeholder="Enter max weight"
                  value={formData.benchPressRm}
                  onChange={handleChange}
                />

                <Input
                  id="sitUpRm"
                  name="sitUpRm"
                  type="number"
                  label="Sit Up Max (reps)"
                  placeholder="Enter max reps"
                  value={formData.sitUpRm}
                  onChange={handleChange}
                />

                <Input
                  id="deadLiftRm"
                  name="deadLiftRm"
                  type="number"
                  step="0.5"
                  label="Deadlift Max (kg)"
                  placeholder="Enter max weight"
                  value={formData.deadLiftRm}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Metrics"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
