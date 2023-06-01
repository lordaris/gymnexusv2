import Layout from "../../../../components/ui/userLayout";
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
  const [name, setName] = useState(user.name);
  const [lastName, setLastName] = useState(user.lastName);

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
        setName(response.data.name);
        setLastName(response.data.lastName);
      })
      .catch((error) => console.error(error));
  }, [userId, token]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    // Perform the API call to update the user's gender, name, and last name information
    axios
      .put(
        process.env.NEXT_PUBLIC_API_URL + `/users/profile/${userId}`,
        { biologicalGender: gender, name: name, lastName: lastName },
        {
          headers: { Authorization: `${token}` },
        }
      )
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
    setName(user.name);
    setLastName(user.lastName);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleAddGender = () => {
    setEditMode(true);
    setShowAddGender(false);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  return (
    <Layout>
      <div className="flex flex-col items-center px-4">
        <h1 className="text-4xl m-4 font-thin font-lato">
          {user.name} {user.lastName} ({user.role})
        </h1>
        {editMode ? (
          <div className="flex flex-col items-center">
            <div className="p-4">
              <input
                type="text"
                placeholder="Name"
                id="name"
                value={name}
                onChange={handleNameChange}
                className="input"
              />
            </div>
            <div className="p-4">
              <input
                placeholder="Last name"
                type="text"
                id="lastName"
                value={lastName}
                onChange={handleLastNameChange}
                className="input"
              />
            </div>

            <div className="p-4">
              <label htmlFor="gender" className="px-4">
                Gender:
              </label>
              <select
                className="select"
                id="gender"
                value={gender}
                onChange={handleGenderChange}
              >
                <option disabled selected>
                  Pick your gender
                </option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            <button className="btn btn-success px-4" onClick={handleSave}>
              Save
            </button>
            <button className="btn btn-error px-4" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {showAddGender ? (
              <p>
                Gender: None{" "}
                <button className="btn btn-success" onClick={handleAddGender}>
                  Add Gender
                </button>
              </p>
            ) : (
              <div>
                <div className="p-4">
                  <p>Name: {name}</p>
                </div>
                <div className="p-4">
                  <p>Last Name: {lastName}</p>
                </div>
                <div className="p-4">
                  <p>Gender: {gender}</p>
                </div>

                <p className="text-gray-500 text-sm p-4">
                  This information is used for calculating body mass index and
                  is not intended to offend or invalidate any gender identity.
                </p>
                <button className="btn btn-success" onClick={handleEdit}>
                  Edit
                </button>
              </div>
            )}
          </div>
        )}
        <div className="flex items-center ml-4">
          <MdEmail className="mr-1" />
          <p className="text-lg p-4 ">{user.email}</p>
        </div>
      </div>
    </Layout>
  );
}
