import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axios from "axios";
import { FaDumbbell, FaUserPlus, FaChartLine } from "react-icons/fa";
import {
  DashboardLayout,
  DashboardSection,
} from "../../../components/ui/dashboardLayout";
import { MetricsChart } from "../../../components/metrics/MetricsChart";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { formatDate } from "../../../utils/dataUtils";

export default function Dashboard() {
  const [metricsData, setMetricsData] = useState([]);
  const [users, setUsers] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = Cookies.get("user");
  const token = Cookies.get("token");
  const router = useRouter();

  useEffect(() => {
    // Fetch all required data
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Parallel API requests for better performance
        const [metricsResponse, usersResponse, workoutsResponse] =
          await Promise.all([
            axios.get(
              process.env.NEXT_PUBLIC_API_URL + `/users/by-user-id/${user}`,
              {
                headers: { Authorization: `${token}` },
              }
            ),
            axios.get(
              process.env.NEXT_PUBLIC_API_URL + `/users/by-coach/${user}`,
              {
                headers: { Authorization: `${token}` },
              }
            ),
            axios.get(
              process.env.NEXT_PUBLIC_API_URL + `/workouts/list/coach/${user}`,
              {
                headers: { Authorization: `${token}` },
              }
            ),
          ]);

        setMetricsData(metricsResponse.data.metrics || []);
        setUsers(usersResponse.data || []);
        setWorkouts(workoutsResponse.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, token]);

  // Define quick actions for the dashboard
  const dashboardActions = [
    {
      label: "New Workout",
      href: "/coach/dashboard/workouts/new/workout",
      icon: <FaDumbbell />,
    },
    {
      label: "New Client",
      href: "/coach/dashboard/users/createuser",
      icon: <FaUserPlus />,
    },
    {
      label: "Add Metrics",
      href: "/coach/dashboard/metrics/new",
      icon: <FaChartLine />,
    },
  ];

  // Define stats for the dashboard
  const dashboardStats = [
    {
      title: "Total Clients",
      value: users.length,
      link: "/coach/dashboard/users",
    },
    {
      title: "Active Workouts",
      value: workouts.filter((w) => w.status === "ACTIVE").length,
      link: "/coach/dashboard/workouts",
    },
    {
      title: "Recent Updates",
      value:
        metricsData.length > 0
          ? formatDate(metricsData[metricsData.length - 1].date, "MMM d")
          : "None",
      link: "/coach/dashboard/metrics/new",
    },
  ];

  // Client list section
  const recentClients = users.slice(0, 5);
  const clientsSection = (
    <DashboardSection
      title="Recent Clients"
      action={
        <Link href="/coach/dashboard/users">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      }
      isLoading={isLoading}
    >
      {recentClients.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-base-content/70 mb-4">No clients added yet</p>
          <Link href="/coach/dashboard/users/createuser">
            <Button variant="primary">Add Your First Client</Button>
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-base-300">
          {recentClients.map((client) => (
            <div
              key={client._id}
              className="py-3 flex justify-between items-center hover:bg-base-300 px-2 rounded-md cursor-pointer"
              onClick={() =>
                router.push(`/coach/dashboard/users/${client._id}`)
              }
            >
              <div>
                <h3 className="font-medium">{client.name || client.email}</h3>
                {client.name && (
                  <p className="text-sm text-base-content/70">{client.email}</p>
                )}
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>
          ))}
        </div>
      )}
    </DashboardSection>
  );

  // Workout list section
  const recentWorkouts = workouts.slice(0, 5);
  const workoutsSection = (
    <DashboardSection
      title="Recent Workouts"
      action={
        <Link href="/coach/dashboard/workouts">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      }
      isLoading={isLoading}
    >
      {recentWorkouts.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-base-content/70 mb-4">No workouts created yet</p>
          <Link href="/coach/dashboard/workouts/new/workout">
            <Button variant="primary">Create Your First Workout</Button>
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-base-300">
          {recentWorkouts.map((workout) => (
            <div
              key={workout._id}
              className="py-3 flex justify-between items-center hover:bg-base-300 px-2 rounded-md cursor-pointer"
              onClick={() =>
                router.push(`/coach/dashboard/workouts/${workout._id}`)
              }
            >
              <div>
                <h3 className="font-medium">{workout.name}</h3>
                <p className="text-sm text-base-content/70">
                  {workout.days.length} day
                  {workout.days.length !== 1 ? "s" : ""} •
                  {workout.assignedTo.length} client
                  {workout.assignedTo.length !== 1 ? "s" : ""}
                </p>
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>
          ))}
        </div>
      )}
    </DashboardSection>
  );

  return (
    <DashboardLayout
      title="Coach Dashboard"
      subtitle="Manage your clients and workout programs"
      actions={dashboardActions}
      stats={dashboardStats}
      isLoading={isLoading}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client List */}
        {clientsSection}

        {/* Workout List */}
        {workoutsSection}
      </div>

      {/* Metrics Charts */}
      {metricsData.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricsChart
            data={metricsData}
            title="Body Composition"
            metrics={["weight", "bodyFatPercentage", "imc"]}
          />

          <MetricsChart
            data={metricsData}
            title="Body Measurements"
            metrics={["chest", "waist", "hips", "thighs", "biceps"]}
          />

          <MetricsChart
            data={metricsData}
            title="Strength Progress"
            metrics={["benchPressRm", "sitUpRm", "deadLiftRm"]}
          />
        </div>
      )}
    </DashboardLayout>
  );
}
