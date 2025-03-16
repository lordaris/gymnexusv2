// src/components/dashboard/DashboardStats.js
import React, { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { usersAPI, workoutsAPI } from "../../utils/apiClient";
import Cookies from "js-cookie";

export const DashboardStats = ({ role }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWorkouts: 0,
    activeWorkouts: 0,
    latestMetrics: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const userId = Cookies.get("user");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const promises = [];

        if (role === "COACH") {
          // Coach-specific data
          promises.push(usersAPI.getByCoach(userId));
          promises.push(workoutsAPI.getByCoach(userId));
        } else {
          // Athlete-specific data
          promises.push(workoutsAPI.getAssigned(userId));
          promises.push(usersAPI.getById(userId));
        }

        const results = await Promise.all(promises);

        if (role === "COACH") {
          const users = results[0].data;
          const workouts = results[1].data;

          setStats({
            totalUsers: users.length,
            totalWorkouts: workouts.length,
            activeWorkouts: workouts.filter((w) => w.status === "ACTIVE")
              .length,
            latestMetrics: null,
          });
        } else {
          const workouts = results[0].data;
          const userData = results[1].data;

          setStats({
            totalWorkouts: workouts.length,
            activeWorkouts: workouts.filter((w) => w.status === "ACTIVE")
              .length,
            latestMetrics:
              userData.metrics && userData.metrics.length > 0
                ? userData.metrics[userData.metrics.length - 1]
                : null,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [role, userId]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-32 animate-pulse bg-base-200"></Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {role === "COACH" && (
        <Card className="p-6 flex flex-col justify-between">
          <h3 className="text-lg font-medium text-base-content/70">
            Total Clients
          </h3>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
          <div className="text-sm mt-2">
            <Link href="/coach/dashboard/users" className="text-primary">
              View all clients →
            </Link>
          </div>
        </Card>
      )}

      <Card className="p-6 flex flex-col justify-between">
        <h3 className="text-lg font-medium text-base-content/70">
          Total Workouts
        </h3>
        <p className="text-3xl font-bold">{stats.totalWorkouts}</p>
        <div className="text-sm mt-2">
          <Link
            href={
              role === "COACH"
                ? "/coach/dashboard/workouts"
                : "/user/dashboard/routines"
            }
            className="text-primary"
          >
            View all workouts →
          </Link>
        </div>
      </Card>

      {stats.latestMetrics && (
        <Card className="p-6 flex flex-col justify-between">
          <h3 className="text-lg font-medium text-base-content/70">
            Latest Stats
          </h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {stats.latestMetrics.weight && (
              <div>
                <span className="text-sm text-base-content/60">Weight:</span>
                <p className="text-xl font-semibold">
                  {stats.latestMetrics.weight} kg
                </p>
              </div>
            )}
            {stats.latestMetrics.bodyFatPercentage && (
              <div>
                <span className="text-sm text-base-content/60">Body Fat:</span>
                <p className="text-xl font-semibold">
                  {Math.round(stats.latestMetrics.bodyFatPercentage * 10) / 10}%
                </p>
              </div>
            )}
          </div>
          <div className="text-sm mt-2">
            <Link
              href={
                role === "COACH"
                  ? "/coach/dashboard/metrics/new"
                  : "/user/dashboard/metrics/new"
              }
              className="text-primary"
            >
              Add new metrics →
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DashboardStats;
