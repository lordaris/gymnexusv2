import LoginRedirect from "../../../components/ui/loginRedirect";
import CoachLayout from "../../../components/ui/coachLayout";
import Link from "next/link";
export default function Dashboard() {
  LoginRedirect();
  return (
    <CoachLayout>
      <div className="flex items-center flex-col">
        <h1 className="text-4xl m-4 font-thin font-lato">Coach Dashboard</h1>
        <div className="mt-8 grid grid-cols-1 gap-4">
          <div>
            <Link href="/coach/dashboard/workouts/new/workout">
              <button className="btn btn-primary btn-lg w-full">
                New Workout
              </button>
            </Link>
          </div>
          <div>
            <Link href="/coach/dashboard/users/createuser">
              <button className="btn btn-primary btn-lg w-full">
                New Client
              </button>
            </Link>
          </div>
        </div>
      </div>
    </CoachLayout>
  );
}
