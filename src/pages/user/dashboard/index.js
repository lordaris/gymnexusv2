import Layout from "../../../components/ui/userLayout";
import Image from "next/image";
import Link from "next/link";

export default function UserDashboard() {
  return (
    <Layout>
      <div className="flex items-center flex-col">
        <h1 className="text-4xl m-4 font-thin font-lato">User Dashboard</h1>
        <Link href={"/user/dashboard/routines"}>
          <button
            className={
              "btn bg-primary hover:bg-primary-focus text-primary-content"
            }
          >
            See my routines          
            </button>
        </Link>
      </div>
    </Layout>
  );
}
