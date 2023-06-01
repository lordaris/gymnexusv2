import User from "../../../../../models/User";
import dbConnect from "../../../../../utils/mongodb";
import authMiddleware from "../../../../../middleware/authMiddleware";

export default async function metricsCrud(req, res) {
  const { method } = req;
  const { id } = req.query;
  const [userId, metricsId] = id;

  try {
    await dbConnect();
    await authMiddleware(req, res, async () => {
      switch (method) {
        case "POST":
          await createMetricsEntry(userId, req.body);
          return res.status(201).json({ message: "Metrics entry created successfully" });
        case "DELETE":
          await deleteMetricsEntry(req, res, userId, metricsId);
          break;
        default:
          res.setHeader("Allow", "POST, DELETE");
          return res.status(405).json({ error: `Method ${method} not allowed` });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function createMetricsEntry(userId, metricsData) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const { neck, waist, hips, height, weight } = metricsData;

  const gender = user.biologicalGender;

  if (gender && neck && waist && hips && height) {
    const neckCm = parseFloat(neck);
    const waistCm = parseFloat(waist);
    const hipsCm = parseFloat(hips);
    const heightCm = parseFloat(height);
    const bodyFatPercentage = calculateBodyFatPercentage(gender, neckCm, waistCm, hipsCm, heightCm);
    metricsData.bodyFatPercentage = bodyFatPercentage;
  }

  if (height && weight) {
    const heightCm = parseFloat(height);
    const weightKg = parseFloat(weight);
    const bmi = calculateBMI(heightCm, weightKg);
    metricsData.imc = bmi;
  }

  user.metrics.push(metricsData);
  await user.save();
}

function calculateBodyFatPercentage(gender, neck, waist, hips, height) {
  if (gender === "MALE") {
    return 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
  } else if (gender === "FEMALE") {
    return 495 / (1.29579 - 0.35004 * Math.log10(waist + hips - neck) + 0.22100 * Math.log10(height)) - 450;
  } else {
    return null;
  }
}

function calculateBMI(height, weight) {
  return weight / Math.pow(height / 100, 2);
}

async function deleteMetricsEntry(req, res, userId, metricsId) {
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "Metrics not found" });
  }

  if (user._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: "You are not authorized to delete this metric!" });
  }

  const metric = user.metrics.id(metricsId);
  if (!metric) {
    return res.status(404).json({ error: "Metrics not found" });
  }

  user.metrics.pull(metricsId);
  await user.save();

  return res.status(200).json({ message: "Metrics deleted successfully" });
}
