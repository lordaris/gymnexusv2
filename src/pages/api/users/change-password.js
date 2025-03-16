import User from "../../../models/User";
import dbConnect from "../../../utils/mongodb";
import authMiddleware from "../../../middleware/authMiddleware";

export default async function changePassword(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await authMiddleware(req, res, async () => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current and new passwords are required" });
    }

    try {
      await dbConnect();
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await user.changePassword(currentPassword, newPassword);

      // Return success response
      return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  });
}
