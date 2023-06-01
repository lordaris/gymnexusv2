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
      <div>
        <h1 className="text-4xl m-4 font-thin font-lato">Users</h1>
        <div className="overflow-x-auto">
          <ul className="list-reset">
            {users.map((user) => (
              <li key={user._id} className="my-4 px-4">
                <div className="border rounded-lg p-4 shadow max-w-md mx-auto">
                  <Link href={`/coach/dashboard/users/${user._id}`}>
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
