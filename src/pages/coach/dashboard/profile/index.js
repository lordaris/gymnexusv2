import CoachLayout from "../../../../components/ui/coachLayout";
import Image from "next/image";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const userId = Cookies.get("user")
  const token = Cookies.get("token")
  const [user, setUser] = useState({});


  useEffect(() => {
    axios
      .get(
        process.env.NEXT_PUBLIC_API_URL + `/users/by-user-id/${userId}`,
        {
          headers: { Authorization: `${token}` },
        }
      )
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => console.error(error));
  }, [userId, token]);

  return (
    <CoachLayout>
      <div className="flex items-center flex-col">
        <h1 className="text-4xl m-4 font-thin font-lato">Profile</h1>
        {user.name}
        <Image
          src="/lunges.png"
          alt="empty-state"
          width={"300"}
          height={"300"}
          className={"opacity-50 p-4"}
        />
        <p className={"opacity-50 text-4xl"}>No data to display</p>
      </div>
    </CoachLayout>
  );
}
