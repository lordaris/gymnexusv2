/*
This will contain the controllers that need params in order to work. 
  Update User (PUT method)
  Delete User (DELETE method)
Login, list and signup will be at the main level of the users endpoint as follows
  api/users/login
  api/users
  api/users/signup 
respectively  
*/

// imports
import User from "../../../../models/User";
import jwt from "jsonwebtoken";
import dbConnect from "../../../../utils/mongodb";
import authMiddleware from "../../../../middleware/authMiddleware";

// Create JWT
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Main function
export default async function userCrud(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();
  await authMiddleware(req, res, async () => {

  /* This is a template to be used with my updateUser and deleteUser controllers */
  switch (method) {
    case "PUT":
      await updateUser(req, res, id);
      break;
    case "DELETE":
      await deleteUser(req, res, id);
      break;
    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      /* 
            This status a message if someone is using a not allowed method 
            (not listed in the Allow header)
            */
      res.status(405).end(`Method ${method} not allowed`);
  }})
}

// Update controller
/* userId will be provided as a param on the main function*/
async function updateUser(req, res, id) {
  const { email, password, name, lastName, age, role } = req.body;
  await dbConnect();
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.set({ email, password, name, lastName, age, role });
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}


async function deleteUser(req, res, id) {
  await dbConnect();
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get the authenticated user id 
    const authenticatedUserId = req.user._id;

    // Verify if the user or the coach that created that user is the one trying to delete it 
    if (user._id.toString() !== authenticatedUserId.toString() && user.addedBy.toString() !== authenticatedUserId.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete this user!" });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}



