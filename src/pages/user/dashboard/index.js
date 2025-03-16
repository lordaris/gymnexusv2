import { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import axios from "axios";
import { FaDumbbell, FaWeight, FaUser } from "react-icons/fa";
import {
  DashboardLayout,
  DashboardSection,
} from "../../../components/ui/dashboardLayout";
import {
  MetricsChart,
  BodyCompositionChart,
  MeasurementsChart,
  StrengthChart,
} from "../../../components/metrics/MetricsChart";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import {
  getMostRecentMetrics,
  formatDate,
  calculateMetricChange,
} from "../../../utils/dataUtils";

export default function Dashboard() {
  const [metricsData, setMetricsData] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = Cookies.get("user");
  const token = Cookies.get("token");

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [userResponse, workoutsResponse] = await Promise.all([
          axios.get(
            process.env.NEXT_PUBLIC_API_URL + `/users/by-user-id/${userId}`,
            { headers: { Authorization: `${token}` } }
          ),
          axios.get(
            process.env.NEXT_PUBLIC_API_URL +
              `/workouts/list/assigned/${userId}`,
            { headers: { Authorization: `${token}` } }
          ),
        ]);

        // Sort metrics by date (newest first)
        const metrics = userResponse.data.metrics || [];
        metrics.sort((a, b) => new Date(b.date) - new Date(a.date));

        setMetricsData(metrics);
        setWorkouts(workoutsResponse.data || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, token]);

  // Calculate changes for metrics if available
  const calculateMetricsChanges = () => {
    if (metricsData.length < 2) return null;

    const latest = metricsData[0];
    const previous = metricsData[1];

    return {
      weight: previous.weight
        ? calculateMetricChange(latest.weight, previous.weight)
        : null,
      bodyFat: previous.bodyFatPercentage
        ? calculateMetricChange(
            latest.bodyFatPercentage,
            previous.bodyFatPercentage
          )
        : null,
      strength: previous.benchPressRm
        ? calculateMetricChange(latest.benchPressRm, previous.benchPressRm)
        : null,
    };
  };

  const changes = metricsData.length > 1 ? calculateMetricsChanges() : null;

  // Define quick actions for the dashboard
  const dashboardActions = [
    {
      label: "My Workouts",
      href: "/user/dashboard/routines",
      icon: <FaDumbbell />,
    },
    {
      label: "Add New Metrics",
      href: "/user/dashboard/metrics/new",
      icon: <FaWeight />,
    },
    {
      label: "View Profile",
      href: "/user/dashboard/profile",
      icon: <FaUser />,
    },
  ];

  // Define stats for the dashboard
  const dashboardStats = [
    {
      title: "Assigned Workouts",
      value: workouts.length,
      link: "/user/dashboard/routines",
    },
    {
      title: "Current Weight",
      value:
        metricsData.length > 0 ? `${metricsData[0].weight || "N/A"} kg` : "N/A",
      change: changes?.weight ? parseFloat(changes.weight) : null,
      changeLabel: "vs previous",
      link: "/user/dashboard/metrics/new",
    },
    {
      title: "Body Fat",
      value:
        metricsData.length > 0 && metricsData[0].bodyFatPercentage
          ? `${metricsData[0].bodyFatPercentage.toFixed(1)}%`
          : "N/A",
      change: changes?.bodyFat ? parseFloat(changes.bodyFat) : null,
      changeLabel: "vs previous",
      link: "/user/dashboard/metrics/new",
    },
  ];

  // Workout preview section
  const workoutsSection = (
    <DashboardSection
      title="My Workouts"
      action={
        <Link href="/user/dashboard/routines">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      }
      isLoading={isLoading}
    >
      {workouts.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-base-content/70 mb-4">No workouts assigned yet</p>
          <p className="text-sm">Your coach will assign workouts to you</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workouts.slice(0, 4).map((workout) => (
            <Link
              key={workout._id}
              href={`/user/dashboard/routines/${workout._id}`}
            >
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="text-lg font-medium">{workout.name}</h3>
                <p className="text-sm text-base-content/70 mt-1">
                  {workout.days.length} training day
                  {workout.days.length !== 1 ? "s" : ""}
                </p>
                {workout.additionalNotes && (
                  <p className="text-sm mt-2 line-clamp-2">
                    {workout.additionalNotes}
                  </p>
                )}
                <div className="mt-2 text-primary text-sm">View workout →</div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </DashboardSection>
  );

  return (
    <DashboardLayout
      title="My Dashboard"
      subtitle="Track your fitness progress"
      actions={dashboardActions}
      stats={dashboardStats}
      isLoading={isLoading}
      error={error}
    >
      {/* Workouts Section */}
      {workoutsSection}

      {/* Metrics Charts */}
      {metricsData.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BodyCompositionChart data={metricsData} />
          <MeasurementsChart data={metricsData} />
          <StrengthChart data={metricsData} />
        </div>
      ) : (
        <Card className="mt-8 text-center py-8">
          <h3 className="text-xl font-medium mb-4">
            Start Tracking Your Progress
          </h3>
          <p className="text-base-content/70 mb-6">
            Add your first metrics to see charts and track your fitness progress
          </p>
          <Link href="/user/dashboard/metrics/new">
            <Button variant="primary" size="lg">
              Add First Metrics
            </Button>
          </Link>
        </Card>
      )}
    </DashboardLayout>
  );
}
