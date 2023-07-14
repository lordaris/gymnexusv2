import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import LoginRedirect from "../../../components/ui/loginRedirect";
import Layout from "../../../components/ui/userLayout";
import Link from "next/link";
import Cookies from "js-cookie";
import axios from "axios";

export default function Dashboard() {
  LoginRedirect();

  const [metricsData, setMetricsData] = useState([]);
  const user = Cookies.get("user");
  const token = Cookies.get("token");

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_API_URL + `/users/by-user-id/${user}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const data = response.data;
        setMetricsData(data.metrics);
      } catch (error) {
        console.error("Error fetching metrics data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="flex items-center flex-col">
        <h1 className="text-4xl m-4 font-lato">User Dashboard</h1>
        <div className="mt-8 grid grid-cols-1 gap-4">
          <div>
            <Link href={"/user/dashboard/routines"}>
              <button className="btn btn-primary btn-lg w-full">
                Go to my workout routines{" "}
              </button>
            </Link>
          </div>
          <div>
            <Link href="/user/dashboard/metrics/new">
              <button className="btn btn-primary btn-lg w-full">
                Add New Metrics
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap">
        {/* Weight and Measurements Line Chart */}
        <div className="w-full md:w-1/2 lg:w-1/3 p-4">
          <h2 className="text-2xl font-bold text-left">
            Weight and Measurements Over Time
          </h2>
          <LineChart width={400} height={250} data={metricsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#8884d8"
              name="Weight"
            />
            <Line
              type="monotone"
              dataKey="chest"
              stroke="#82ca9d"
              name="Chest"
            />
            <Line
              type="monotone"
              dataKey="waist"
              stroke="#ff7f50"
              name="Waist"
            />
            <Line type="monotone" dataKey="hips" stroke="#ff00ff" name="Hips" />
            <Line
              type="monotone"
              dataKey="thighs"
              stroke="#008080"
              name="Thighs"
            />
            <Line
              type="monotone"
              dataKey="biceps"
              stroke="#ffa500"
              name="Biceps"
            />{" "}
          </LineChart>
        </div>
        {/* Body Fat Percentage Line Chart */}
        <div className="w-full md:w-1/2 lg:w-1/3 p-4">
          <h2 className="text-2xl font-bold">Body Fat Percentage Over Time</h2>
          <LineChart width={400} height={250} data={metricsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="bodyFatPercentage"
              stroke="#8884d8"
              name="Body Fat Percentage"
            />{" "}
          </LineChart>
        </div>
        {/* BMI Line Chart */}
        <div className="w-full md:w-1/2 lg:w-1/3 p-4">
          <h2 className="text-2xl font-bold">BMI Over Time</h2>
          <LineChart width={400} height={250} data={metricsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="imc"
              stroke="#82ca9d"
              name="BMI"
            />{" "}
          </LineChart>
        </div>
        {/* Strength Measurements Line Chart */}
        <div className="w-full md:w-1/2 lg:w-1/3 p-4">
          <h2 className="text-2xl font-bold">
            Strength Measurements Over Time
          </h2>
          <LineChart width={400} height={250} data={metricsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="benchPressRm"
              stroke="#8884d8"
              name="Bench Press RM"
            />
            <Line
              type="monotone"
              dataKey="sitUpRm"
              stroke="#82ca9d"
              name="Sit Up RM"
            />
            <Line
              type="monotone"
              dataKey="deadLiftRm"
              stroke="#ff7f50"
              name="Deadlift RM"
            />{" "}
          </LineChart>
        </div>
        {/* Add more charts for other metrics here */}
      </div>
    </Layout>
  );
}
