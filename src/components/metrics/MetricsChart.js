import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "../ui/card";
import { format, parseISO } from "date-fns";

// Color palette for chart lines
const CHART_COLORS = {
  weight: "#8884d8",
  bodyFatPercentage: "#ff8042",
  imc: "#82ca9d",
  chest: "#8dd1e1",
  waist: "#a4de6c",
  hips: "#d0ed57",
  thighs: "#ffc658",
  biceps: "#83a6ed",
  benchPressRm: "#8884d8",
  sitUpRm: "#82ca9d",
  deadLiftRm: "#ff8042",
};

// Format date for display
const formatDate = (dateString) => {
  try {
    if (!dateString) return "";
    // Handle both ISO strings and date objects
    const date =
      typeof dateString === "string"
        ? parseISO(dateString)
        : new Date(dateString);
    return format(date, "MMM d, yyyy");
  } catch (error) {
    console.error("Date formatting error:", error);
    return dateString;
  }
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-base-100 p-3 border border-base-300 rounded shadow-md">
      <p className="font-medium">{formatDate(label)}</p>
      <div className="mt-2">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center my-1">
            <div
              className="w-3 h-3 mr-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="mr-2 text-sm">{entry.name}:</span>
            <span className="font-medium">{entry.value.toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Custom formatter for X-axis dates
const xAxisTickFormatter = (value) => {
  try {
    if (!value) return "";
    return format(new Date(value), "MMM d");
  } catch (error) {
    return value;
  }
};

export const MetricsChart = ({
  data = [],
  title = "Metrics Over Time",
  metrics = [],
  aspectRatio = 16 / 9,
  height = 300,
}) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Transform data for chart
    if (!data || !data.length) return;

    const formattedData = data.map((item) => ({
      ...item,
      date: item.date || new Date(), // Fallback to today if no date
    }));

    // Sort by date ascending
    formattedData.sort((a, b) => new Date(a.date) - new Date(b.date));

    setChartData(formattedData);
  }, [data]);

  // If no metrics specified, show all available
  const metricsToShow = metrics.length ? metrics : Object.keys(CHART_COLORS);

  // Filter metrics to only those that exist in data
  const availableMetrics = metricsToShow.filter((metric) =>
    chartData.some(
      (item) => item[metric] !== undefined && item[metric] !== null
    )
  );

  if (!chartData.length || !availableMetrics.length) {
    return (
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <div className="flex justify-center items-center h-40">
          <p className="text-base-content/60">No data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={xAxisTickFormatter}
              minTickGap={30}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {availableMetrics.map((metric) => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                name={
                  metric.charAt(0).toUpperCase() +
                  metric.slice(1).replace(/([A-Z])/g, " $1")
                } // Add spaces to camelCase
                stroke={CHART_COLORS[metric] || "#8884d8"}
                activeDot={{ r: 8 }}
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

// Specialized metric chart components
export const BodyCompositionChart = ({ data }) => (
  <MetricsChart
    data={data}
    title="Body Composition"
    metrics={["weight", "bodyFatPercentage", "imc"]}
  />
);

export const MeasurementsChart = ({ data }) => (
  <MetricsChart
    data={data}
    title="Body Measurements"
    metrics={["chest", "waist", "hips", "thighs", "biceps"]}
  />
);

export const StrengthChart = ({ data }) => (
  <MetricsChart
    data={data}
    title="Strength Progress"
    metrics={["benchPressRm", "sitUpRm", "deadLiftRm"]}
  />
);
