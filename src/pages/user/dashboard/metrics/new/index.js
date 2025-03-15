import { useState } from "react";
import Layout from "../../../../../components/ui/userLayout";
import axios from "axios";
import Cookies from "js-cookie";
import { format } from "date-fns";
const currentDate = format(new Date(), "yyyy-MM-dd");

export default function AddMetricsPage() {
  const [formData, setFormData] = useState({
    date: currentDate,
    weight: "",
    neck: "",
    height: "",
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
      // Show success message or navigate back to the dashboard
    } catch (error) {
      console.error("Error adding metrics:", error);
      // Show error message
    }
  };

  return (
    <Layout>
      <h1 className="text-4xl m-4 font-thin font-lato">Add New Metrics</h1>
      <div className="flex justify-center mt-4">
        <p className="text-xl max-w-md">
          <p className="text-xl">Feel free to add any metric you like.</p>
          If you add{" "}
          <span className="text-primary">
            weight, height, neck, waist, and hips,
          </span>{" "}
          the app will calculate your{" "}
          <span className="text-primary-focus">
            BMI and body fat percentage{" "}
          </span>
          and add that information to the corresponding line chart. You need to
          update your biological sex on your profile to make the body fat
          percentage calculations work
        </p>
      </div>
      <div className="mt-8">
        <form onSubmit={handleSubmit}>
          <div className="p-4">
            <input
              type="number"
              name="weight"
              placeholder="Weight (kg)"
              value={formData.weight}
              onChange={handleChange}
              className="input w-full max-w-xs"
            />
          </div>
          <div className="p-4">
            <input
              type="number"
              name="height"
              placeholder="Height (cm)"
              value={formData.height}
              onChange={handleChange}
              className="input w-full max-w-xs"
            />
          </div>
          <div className="p-4">
            {" "}
            <input
              type="number"
              name="neck"
              placeholder="Neck (cm)"
              value={formData.neck}
              onChange={handleChange}
              className="input w-full max-w-xs"
            />
          </div>
          <div className="p-4">
            {" "}
            <input
              type="number"
              name="chest"
              placeholder="Chest (cm)"
              value={formData.chest}
              onChange={handleChange}
              className="input w-full max-w-xs"
            />
          </div>
          <div className="p-4">
            <input
              type="number"
              name="waist"
              placeholder="Waist (cm)"
              value={formData.waist}
              onChange={handleChange}
              className="input w-full max-w-xs"
            />
          </div>
          <div className="p-4">
            <input
              type="number"
              name="hips"
              placeholder="Hips (cm)"
              value={formData.hips}
              onChange={handleChange}
              className="input w-full max-w-xs"
            />
          </div>
          <div className="p-4">
            <input
              type="number"
              name="thighs"
              placeholder="Thighs (cm)"
              value={formData.thighs}
              onChange={handleChange}
              className="input w-full max-w-xs"
            />
          </div>
          <div className="p-4">
            <input
              type="number"
              name="biceps"
              placeholder="Biceps (cm)"
              value={formData.biceps}
              onChange={handleChange}
              className="input w-full max-w-xs"
            />
          </div>
          <div className="flex justify-center mt-4">
            <section className="bg-neutral max-w-md">
              <div className="p-4">
                <input
                  type="number"
                  name="benchPressRm"
                  placeholder="Bench Press Max (kg)"
                  value={formData.benchPressRm}
                  onChange={handleChange}
                  className="input w-full max-w-xs"
                />
              </div>
              <div className="p-4">
                <input
                  type="number"
                  name="sitUpRm"
                  placeholder="Sit Up Max (kg)"
                  value={formData.sitUpRm}
                  onChange={handleChange}
                  className="input w-full max-w-xs"
                />
              </div>
              <div className="p-4">
                <input
                  type="number"
                  name="deadLiftRm"
                  placeholder="Deadlift Max (kg)"
                  value={formData.deadLiftRm}
                  onChange={handleChange}
                  className="input w-full max-w-xs"
                />
              </div>
            </section>
          </div>

          <div className="flex justify-center mt-4 p-4">
            <button type="submit" className="btn btn-primary">
              Save Metrics
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
