import CoachLayout from "../../../../components/ui/coachLayout";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import { MdEmail } from "react-icons/md";

export default function Profile() {
  const userId = Cookies.get("user");
  const token = Cookies.get("token");
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [gender, setGender] = useState(user.biologicalGender);
  const [showAddGender, setShowAddGender] = useState(false);

  useEffect(() => {
    axios
      .get(process.env.NEXT_PUBLIC_API_URL + `/users/by-user-id/${userId}`, {
        headers: { Authorization: `${token}` },
      })
      .then((response) => {
        setUser(response.data);
        setGender(response.data.biologicalGender);
        if (!response.data.biologicalGender) {
          setShowAddGender(true);
        }
      })
      .catch((error) => console.error(error));
  }, [userId, token]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    // Perform the API call to update the user's gender information
    axios
      .put(process.env.NEXT_PUBLIC_API_URL + `/users/profile/${userId}`, { biologicalGender: gender }, {
        headers: { Authorization: `${token}` },
      })
      .then((response) => {
        // Update the user object in state with the updated data
        setUser(response.data);
        setEditMode(false);
        setShowAddGender(false);
      })
      .catch((error) => {
        console.error(error);
        // Handle error scenarios if needed
      });
  };

  const handleCancel = () => {
    setEditMode(false);
    setGender(user.biologicalGender);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleAddGender = () => {
    setEditMode(true);
    setShowAddGender(false);
  };

  return (
    <CoachLayout>
      <div className="flex flex-col items-center px-4">
        <h1 className="text-4xl m-4 font-thin font-lato">
          {user.name} {user.lastName} ({user.role})
        </h1>
        {editMode ? (
          <div>
            <label htmlFor="gender">Gender:</label>
            <select className="select" id="gender" value={gender} onChange={handleGenderChange}>
            <option disabled selected>Pick your gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            <button className="btn btn-success" onClick={handleSave}>Save</button>
            <button className="btn btn-error" onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <div>
            {showAddGender ? (
              <p>
                Gender: None <button className="btn btn-success" onClick={handleAddGender}>Add Gender</button>
              </p>
            ) : (
              <div>
              <p>
                Gender: {gender} <button className="btn btn-success" onClick={handleEdit}>Edit</button>
              </p>
                <p className="text-gray-500 text-sm">
                This information is used for calculating body mass index and is not intended to offend or invalidate any gender identity.
              </p>
            </div>
              
            )}
            
          </div>
        )}
        <div className="flex items-center ml-4">
          <MdEmail className="mr-1" />
          <p className="text-lg p-4 ">{user.email}</p>
        </div>
      </div>
    </CoachLayout>
  );
}
