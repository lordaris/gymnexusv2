import CoachLayout from "../../../../components/ui/coachLayout";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { BsTrashFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { PageHeader } from "../../../../components/ui/pageHeader";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { ListItem } from "../../../../components/ui/listItem";

export default function UserWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const userId = router.query.id;
  const coachId = Cookies.get("user");
  const token = Cookies.get("token");

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [workoutsResponse, userResponse] = await Promise.all([
          axios.get(
            process.env.NEXT_PUBLIC_API_URL +
              `/workouts/list/assigned/${userId}`,
            { headers: { Authorization: `${token}` } }
          ),
          axios.get(
            process.env.NEXT_PUBLIC_API_URL + `/users/by-user-id/${userId}`,
            { headers: { Authorization: `${token}` } }
          ),
        ]);

        setWorkouts(workoutsResponse.data);
        setUser(userResponse.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, token]);

  const handleUnassign = (workoutId) => {
    if (window.confirm("Are you sure you want to unassign this workout?")) {
      axios
        .put(
          process.env.NEXT_PUBLIC_API_URL +
            `/workouts/unassign/${workoutId}/${userId}`,
          {},
          { headers: { Authorization: `${token}` } }
        )
        .then(() => {
          toast.success("Workout unassigned successfully");
          setWorkouts((prevWorkouts) =>
            prevWorkouts.filter((workout) => workout._id !== workoutId)
          );
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to unassign workout");
        });
    }
  };

  const handleDeleteUser = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      axios
        .delete(process.env.NEXT_PUBLIC_API_URL + `/users/profile/${userId}`, {
          headers: { Authorization: `${token}` },
        })
        .then(() => {
          toast.success("User deleted successfully");
          router.push("/coach/dashboard/users");
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to delete user");
        });
    }
  };

  if (isLoading) {
    return (
      <CoachLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </CoachLayout>
    );
  }

  const displayName = user.name || user.email;

  return (
    <CoachLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <PageHeader
          title={`User: ${displayName}`}
          action={
            <Button
              variant="error"
              size="md"
              onClick={handleDeleteUser}
              className="flex items-center gap-2"
            >
              <BsTrashFill /> Delete User
            </Button>
          }
        />

        <Card
          title="Assigned Workouts"
          className="mb-8"
          actionButton={
            <Link href={`/coach/dashboard/users/assign/${user._id}`}>
              <Button variant="primary" size="sm">
                Assign Workout
              </Button>
            </Link>
          }
        >
          {workouts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-base-content/70 mb-4">
                No workouts assigned yet
              </p>
              <Link href={`/coach/dashboard/users/assign/${user._id}`}>
                <Button variant="primary">Assign a Workout</Button>
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {workouts.map((workout) => (
                <ListItem
                  key={workout._id}
                  title={workout.name}
                  onClick={() =>
                    router.push(`/coach/dashboard/workouts/${workout._id}`)
                  }
                  actionButton={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-error hover:bg-error hover:bg-opacity-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnassign(workout._id);
                      }}
                    >
                      <BsTrashFill />
                    </Button>
                  }
                />
              ))}
            </ul>
          )}
        </Card>

        <div className="flex justify-center">
          <Link href="/coach/dashboard/users">
            <Button variant="ghost" size="md">
              Back to Users List
            </Button>
          </Link>
        </div>
      </div>
    </CoachLayout>
  );
}
