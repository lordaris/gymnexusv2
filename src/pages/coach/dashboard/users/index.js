import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import Layout from "../../../../components/ui/coachLayout";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = Cookies.get("token");
      const coachId = Cookies.get("user");
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + `/users/by-coach/${coachId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      const data = response.data;
      console.log(data);
      if (data && data.length > 0) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  return (
    <Layout>
      <div className="text-center mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-lato py-4">Users</h1>
        <div className="overflow-x-auto">
          <ul className="space-y-6 py-4">
            {users.map((user) => (
              <li key={user._id} className="bg-base-200 rounded-lg shadow-md">
                <div className="text-4xl font-lato cursor-pointer py-4 px-6 flex justify-center items-center hover:text-primary-focus">
                  <Link
                    href={`/coach/dashboard/users/${user._id}`}
                    className="hover:text-primary text-3xl font-extrabold font-lato hover:text-primary-dark"
                  >
                    {user.name ? user.name : user.email}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}
