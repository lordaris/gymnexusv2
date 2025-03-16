import React, { useState } from "react";
import Link from "next/link";
import { FaChevronDown, FaChevronUp, FaPlus, FaTrash } from "react-icons/fa";
import { Button } from "../ui/button";
import { ExerciseCard } from "./ExerciseCard";

export const WorkoutDay = ({
  day,
  workoutId,
  isCoach = false,
  onDeleteDay,
  onDeleteExercise,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-base-200 rounded-lg overflow-hidden mb-4 shadow-sm">
      <div
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-base-300"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h2 className="text-xl font-medium">
            {day.day}
            <span className="text-base-content/60 ml-2">({day.focus})</span>
          </h2>
          <p className="text-sm text-base-content/60">
            {day.exercises.length} exercise
            {day.exercises.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isCoach && (
            <>
              <Link
                href={`/coach/dashboard/workouts/new/exercise/${workoutId}/${day._id}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="primary"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <FaPlus size={12} /> Add
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                className="text-error hover:bg-error hover:bg-opacity-10"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteDay && onDeleteDay(day._id);
                }}
              >
                <FaTrash size={14} />
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <FaChevronUp size={16} />
            ) : (
              <FaChevronDown size={16} />
            )}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 bg-base-100">
          {day.exercises.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-base-content/60 mb-4">
                No exercises added yet
              </p>
              {isCoach && (
                <Link
                  href={`/coach/dashboard/workouts/new/exercise/${workoutId}/${day._id}`}
                >
                  <Button variant="primary" size="sm">
                    Add Exercise
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {day.exercises.map((exercise) => (
                <ExerciseCard
                  key={exercise._id}
                  exercise={exercise}
                  dayId={day._id}
                  workoutId={workoutId}
                  isCoach={isCoach}
                  onDelete={() =>
                    onDeleteExercise && onDeleteExercise(day._id, exercise._id)
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
