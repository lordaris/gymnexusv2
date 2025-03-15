// src/pages/coach/dashboard/workouts/index.js
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Layout from "../../../../components/ui/coachLayout";
import { PageHeader } from "../../../../components/ui/pageHeader";
import { Button } from "../../../../components/ui/button";
import { ListItem } from "../../../../components/ui/listItem";
import { DataLoader, EmptyState } from "../../../../components/ui/dataLoader";
import { workoutsAPI } from "../../../../utils/apiClient";

export default function RoutinesPage() {
  const [routines, setRoutines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchWorkouts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const coachId = Cookies.get("user");
      const response = await workoutsAPI.getByCoach(coachId);
      setRoutines(response.data || []);
    } catch (err) {
      setError("Failed to load workouts. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Workouts"
          action={
            <Link href="/coach/dashboard/workouts/new/workout">
              <Button variant="primary" size="md">
                New Workout
              </Button>
            </Link>
          }
        />

        <DataLoader
          isLoading={isLoading}
          error={error}
          isEmpty={routines.length === 0}
          onRetry={fetchWorkouts}
          emptyStateProps={{
            title: "No workouts found",
            message: "Create your first workout to get started",
            actionButton: (
              <Link href="/coach/dashboard/workouts/new/workout">
                <Button variant="primary" size="lg">
                  Create Workout
                </Button>
              </Link>
            ),
          }}
        >
          <ul className="space-y-4 py-4">
            {routines.map((workout) => (
              <ListItem
                key={workout._id}
                title={workout.name}
                onClick={() =>
                  router.push(`/coach/dashboard/workouts/${workout._id}`)
                }
              />
            ))}
          </ul>
        </DataLoader>
      </div>
    </Layout>
  );
}
