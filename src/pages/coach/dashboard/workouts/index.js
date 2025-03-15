import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../../../../components/ui/coachLayout";
import { PageHeader } from "../../../../components/ui/pageHeader";
import { Button } from "../../../../components/ui/button";
import { ListItem } from "../../../../components/ui/listItem";

export default function RoutinesPage() {
  const [routines, setRoutines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        setIsLoading(true);
        const token = Cookies.get("token");
        const coachId = Cookies.get("user");
        const response = await axios.get(
          process.env.NEXT_PUBLIC_API_URL + `/workouts/list/coach/${coachId}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const data = response.data;
        setRoutines(data && data.length > 0 ? data : []);
      } catch (err) {
        setError("Failed to load workouts. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoutines();
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

        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="alert alert-error shadow-lg">
            <span>{error}</span>
          </div>
        ) : routines.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-lato mb-4">No workouts found</h3>
            <p className="text-base-content/70 mb-6">
              Create your first workout to get started
            </p>
            <Link href="/coach/dashboard/workouts/new/workout">
              <Button variant="primary" size="lg">
                Create Workout
              </Button>
            </Link>
          </div>
        ) : (
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
        )}
      </div>
    </Layout>
  );
}
