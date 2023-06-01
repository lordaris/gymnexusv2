import mongoose from 'mongoose';

const { Schema } = mongoose;

const ExerciseSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: 100,
  },
  sets: {
    type: Number,
    required: true,
  },
  reps: {
    type: Number,
    required: true,
  },
  cadence: {
    type: String,
  },
  notes: String,
  video: {
    type: String,
  },
});

const DaySchema = new Schema({
  day: {
    type: String,
    required: true,
  },
  focus: {
    type: String,
    required: true,
  },
  exercises: [ExerciseSchema],
});

const WorkoutSchema = new Schema({
  coach: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedTo: [
    {
      type: String,
    },
  ],
  name: String,
  additionalNotes: String,
  days: [DaySchema],
  status: {
    type: String,
    required: true,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE',
  },
});

const Workout = mongoose.models.Workout || mongoose.model('Workout', WorkoutSchema);
export default Workout;
