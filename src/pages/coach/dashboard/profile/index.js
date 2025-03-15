import Layout from "../../../../components/ui/coachLayout";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import { MdEmail } from "react-icons/md";
import { PageHeader } from "../../../../components/ui/pageHeader";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Select } from "../../../../components/ui/select";
import { Card } from "../../../../components/ui/card";

export default function Profile() {
  const userId = Cookies.get("user");
  const token = Cookies.get("token");
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [gender, setGender] = useState("");
  const [showAddGender, setShowAddGender] = useState(false);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          process.env.NEXT_PUBLIC_API_URL + `/users/by-user-id/${userId}`,
          {
            headers: { Authorization: `${token}` },
          }
        );
        const userData = response.data;
        setUser(userData);
        setGender(userData.biologicalGender || "");
        setName(userData.name || "");
        setLastName(userData.lastName || "");
        setShowAddGender(!userData.biologicalGender);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId, token]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      const response = await axios.put(
        process.env.NEXT_PUBLIC_API_URL + `/users/profile/${userId}`,
        { biologicalGender: gender, name, lastName },
        {
          headers: { Authorization: `${token}` },
        }
      );
      setUser(response.data);
      setEditMode(false);
      setShowAddGender(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setGender(user.biologicalGender || "");
    setName(user.name || "");
    setLastName(user.lastName || "");
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleAddGender = () => {
    setEditMode(true);
    setShowAddGender(false);
  };

  const genderOptions = [
    { value: "", label: "Select gender" },
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4">
        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <PageHeader
              title={`${user.name || ""} ${user.lastName || ""}`}
              subtitle={`${user.role || "User"} Profile`}
            />

            <Card className="w-full max-w-lg mx-auto">
              <div className="flex items-center mb-6">
                <MdEmail className="text-2xl text-primary mr-2" />
                <p className="text-lg">{user.email}</p>
              </div>

              {editMode ? (
                <div className="space-y-6">
                  <Input
                    id="name"
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    label="Name"
                  />

                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    label="Last Name"
                  />

                  <Select
                    id="gender"
                    value={gender}
                    onChange={handleGenderChange}
                    options={genderOptions}
                    label="Gender"
                  />

                  <div className="flex justify-center space-x-4 pt-4">
                    <Button
                      variant="success"
                      onClick={handleSave}
                      disabled={saveLoading}
                    >
                      {saveLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      variant="error"
                      onClick={handleCancel}
                      disabled={saveLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {showAddGender ? (
                    <div className="alert alert-info mb-4">
                      <div className="flex justify-between items-center w-full">
                        <span>Gender information is missing</span>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleAddGender}
                        >
                          Add Gender
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-lg">
                      <p>
                        <span className="font-semibold">Name:</span>{" "}
                        {name || "Not set"}
                      </p>
                      <p>
                        <span className="font-semibold">Last Name:</span>{" "}
                        {lastName || "Not set"}
                      </p>
                      <p>
                        <span className="font-semibold">Gender:</span>{" "}
                        {gender || "Not set"}
                      </p>
                    </div>
                  )}

                  <p className="text-sm text-base-content/60 mt-4">
                    Gender is used for calculating body mass index and is not
                    intended to offend or invalidate any gender identity.
                  </p>

                  <div className="pt-4">
                    <Button variant="primary" onClick={handleEdit}>
                      Edit Profile
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
