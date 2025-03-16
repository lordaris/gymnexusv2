import React from "react";
import Link from "next/link";
import { FaEdit, FaTrash, FaPlay, FaLink } from "react-icons/fa";
import { Button } from "../ui/button";

export const ExerciseCard = ({
  exercise,
  dayId,
  workoutId,
  isCoach = false,
  onDelete,
  showControls = true,
}) => {
  const hasVideo = !!(exercise.video && exercise.video.trim());

  return (
    <div className="bg-base-100 p-4 rounded-lg shadow-sm mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          {hasVideo ? (
            <div className="mr-3 text-primary">
              <FaPlay size={16} />
            </div>
          ) : null}

          <div>
            <h3 className="text-xl font-medium">
              {hasVideo ? (
                <a
                  href={exercise.video}
                  className="text-primary hover:underline flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {exercise.name}
                  <span className="text-xs inline-flex items-center">
                    <FaLink className="ml-1" size={12} />
                  </span>
                </a>
              ) : (
                exercise.name
              )}
            </h3>
          </div>
        </div>

        {isCoach && showControls && (
          <div className="flex items-center gap-2">
            <Link
              href={`/coach/dashboard/workouts/update/${workoutId}/${dayId}/${exercise._id}`}
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-secondary hover:bg-secondary hover:bg-opacity-10"
              >
                <FaEdit size={16} />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              className="text-error hover:bg-error hover:bg-opacity-10"
              onClick={() => onDelete && onDelete(exercise._id)}
            >
              <FaTrash size={14} />
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
        <div className="bg-base-200 p-2 rounded text-center">
          <span className="text-sm text-base-content/60 block">Sets</span>
          <span className="font-semibold text-lg">{exercise.sets}</span>
        </div>

        <div className="bg-base-200 p-2 rounded text-center">
          <span className="text-sm text-base-content/60 block">Reps</span>
          <span className="font-semibold text-lg">{exercise.reps}</span>
        </div>

        {exercise.cadence && (
          <div className="bg-base-200 p-2 rounded text-center">
            <span className="text-sm text-base-content/60 block">Cadence</span>
            <span className="font-semibold text-lg">{exercise.cadence}</span>
          </div>
        )}
      </div>

      {exercise.notes && (
        <div className="mt-3 p-3 bg-base-200 rounded text-sm">
          <span className="text-base-content/60 font-medium">Notes:</span>
          <p className="mt-1">{exercise.notes}</p>
        </div>
      )}
    </div>
  );
};
