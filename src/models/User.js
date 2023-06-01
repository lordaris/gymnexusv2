import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const { Schema } = mongoose;

const metricsSchema = new Schema({
  date: Date,
  weight: Number, 
  height: Number,
  neck: Number,
  chest: Number,
  waist: Number, 
  hips: Number,
  tights: Number, 
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
    enum: ['COACH', 'ATHLETE'],
    default: 'COACH',
  },
  addedBy: {
    type: Schema.Types.ObjectId,
  },
});

// Static createuser method
userSchema.statics.signup = async function (email, password, role, addedBy) {
  // Validation
  if (!email || !password || !role) {
    throw new Error('Email, password, and role are required');
  }
  if (!validator.isEmail(email)) {
    throw new Error('Email is not valid');
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      'Password is not strong enough. It must contain at least 8 characters, 1 lowercase, 1 uppercase, 1 number, and 1 symbol'
    );
  }
  if (!['COACH', 'ATHLETE'].includes(role)) {
    throw new Error('Role must be either COACH or ATHLETE');
  }

  const exist = await this.findOne({ email });
  if (exist) {
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash, role, addedBy });

  return user;
};

// Static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw new Error('Wrong credentials');
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error('Wrong credentials');
  }

  return user;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;