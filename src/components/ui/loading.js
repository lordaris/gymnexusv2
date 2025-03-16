import React from "react";

export const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    xs: "h-4 w-4",
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };

  return (
    <div
      className={`animate-spin rounded-full border-t-2 border-b-2 border-primary ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
    />
  );
};

export const PageLoader = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <LoadingSpinner size="lg" className="mb-4" />
      <p className="text-base-content/70">{message}</p>
    </div>
  );
};

export const FullScreenLoader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-base-100 bg-opacity-50 z-50">
      <div className="bg-base-200 p-8 rounded-lg shadow-lg flex flex-col items-center">
        <LoadingSpinner size="xl" className="mb-4" />
        <p className="text-lg">{message}</p>
      </div>
    </div>
  );
};

export const ButtonLoader = ({ className = "" }) => {
  return <LoadingSpinner size="xs" className={`inline mr-2 ${className}`} />;
};

// Skeleton loaders for UI elements
export const SkeletonText = ({ width = "w-full", height = "h-4" }) => {
  return (
    <div className={`${width} ${height} bg-base-300 animate-pulse rounded`} />
  );
};

export const SkeletonCircle = ({ size = "h-12 w-12" }) => {
  return <div className={`${size} bg-base-300 animate-pulse rounded-full`} />;
};

export const SkeletonCard = ({ className = "" }) => {
  return (
    <div className={`p-4 bg-base-200 rounded-lg animate-pulse ${className}`}>
      <SkeletonText width="w-3/4" className="mb-4" />
      <SkeletonText width="w-full" className="mb-2" />
      <SkeletonText width="w-full" className="mb-2" />
      <SkeletonText width="w-2/3" className="mb-2" />
    </div>
  );
};

export const WorkoutSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <SkeletonText width="w-1/3" height="h-8" />
        <SkeletonText width="w-24" height="h-8" />
      </div>

      <SkeletonCard className="mb-4" />

      {[1, 2].map((i) => (
        <div key={i} className="bg-base-200 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-3">
            <SkeletonText width="w-1/4" height="h-6" />
            <SkeletonText width="w-16" height="h-6" />
          </div>

          {[1, 2].map((j) => (
            <div key={j} className="bg-base-100 p-4 rounded-lg mb-3">
              <SkeletonText width="w-1/3" height="h-5" className="mb-3" />
              <div className="grid grid-cols-3 gap-3 mb-3">
                <SkeletonText height="h-8" />
                <SkeletonText height="h-8" />
                <SkeletonText height="h-8" />
              </div>
              <SkeletonText width="w-full" height="h-16" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const ProfileSkeleton = () => {
  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center mb-6">
        <SkeletonCircle size="h-16 w-16" />
        <div className="ml-4">
          <SkeletonText width="w-48" height="h-6" className="mb-2" />
          <SkeletonText width="w-32" height="h-4" />
        </div>
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="mb-4">
            <SkeletonText width="w-24" height="h-4" className="mb-2" />
            <SkeletonText width="w-full" height="h-10" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} className="h-32" />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <SkeletonText width="w-48" height="h-6" className="mb-4" />
          <SkeletonCard className="h-64" />
        </div>
        <div>
          <SkeletonText width="w-48" height="h-6" className="mb-4" />
          <SkeletonCard className="h-64" />
        </div>
      </div>
    </div>
  );
};
