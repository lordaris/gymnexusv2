import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const { Schema } = mongoose;
const SALT_ROUNDS = 12;
const metricsSchema = new Schema({
  date: Date,
  weight: Number,
  height: Number,
  neck: Number,
  chest: Number,
  waist: Number,
  hips: Number,
  thighs: Number,
  imc: Number,
  bodyFatPercentage: Number,
  biceps: Number,
  benchPressRm: Number,
  sitUpRm: Number,
  deadLiftRm: Number,
});

const medicalSchema = new Schema({
  illnesses: [String],
  injuries: [String],
  allergies: [String],
  medications: [String],
  surgeries: [String],
  familyHistory: [String],
});

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: String,
  lastName: String,
  age: Number,
  biologicalGender: String,
  metrics: [metricsSchema],
  medical: medicalSchema,
  role: {
    type: String,
    required: true,
    enum: ["COACH", "ATHLETE"],
    default: "COACH",
  },
  addedBy: {
    type: Schema.Types.ObjectId,
  },
  passwordHistory: [
    {
      hash: String,
      createdAt: Date,
    },
  ],
  passwordLastChanged: {
    type: Date,
    default: Date.now,
  },
});

// Static createuser method
userSchema.statics.signup = async function (email, password, role, addedBy) {
  // Validation
  if (!email || !password || !role) {
    throw new Error("Email, password, and role are required");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password is not strong enough. It must contain at least 8 characters, 1 lowercase, 1 uppercase, 1 number, and 1 symbol"
    );
  }
  if (!["COACH", "ATHLETE"].includes(role)) {
    throw new Error("Role must be either COACH or ATHLETE");
  }

  const exist = await this.findOne({ email });
  if (exist) {
    throw new Error("User already exists");
  }

  const passwordHistory = [];

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);

  // Store password hash in history
  passwordHistory.push({
    hash: hash,
    createdAt: new Date(),
  });

  // Create user with password history
  const user = await this.create({
    email,
    password: hash,
    role,
    addedBy,
    passwordHistory,
  });

  return user;
};

// Static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("Wrong credentials");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Wrong credentials");
  }

  return user;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

// Add a method to change password securely
userSchema.methods.changePassword = async function (
  currentPassword,
  newPassword
) {
  // Verify current password
  const isMatch = await bcrypt.compare(currentPassword, this.password);
  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  // Validate new password strength
  if (!validator.isStrongPassword(newPassword)) {
    throw new Error("New password is not strong enough");
  }

  // Check if new password matches recent passwords (last 3)
  for (const historyItem of this.passwordHistory.slice(-3)) {
    const isReused = await bcrypt.compare(newPassword, historyItem.hash);
    if (isReused) {
      throw new Error("New password cannot be the same as recent passwords");
    }
  }

  // Hash the new password
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(newPassword, salt);

  // Update password and add to history
  this.password = hash;

  // Add password to history
  this.passwordHistory.push({
    hash: hash,
    createdAt: new Date(),
  });

  // Limit password history to last 5 entries
  if (this.passwordHistory.length > 5) {
    this.passwordHistory = this.passwordHistory.slice(-5);
  }

  await this.save();

  return true;
};

