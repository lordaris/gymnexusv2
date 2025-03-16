import React from "react";
import Head from "next/head";
import { useAuth } from "../../contexts/AuthContext";
import { PageHeader } from "./pageHeader";
import CoachLayout from "./coachLayout";
import UserLayout from "./userLayout";
import { PageTitle } from "./pageTitle";

export const PageLayout = ({
  children,
  title = "",
  description = "",
  pageTitle,
  pageSubtitle,
  actionButton,
  maxWidth = "max-w-6xl",
  isLoading = false,
  error = null,
  hideHeader = false,
}) => {
  const { isCoach, isAthlete } = useAuth();

  // Select the appropriate layout based on user role
  const LayoutComponent = isCoach() ? CoachLayout : UserLayout;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="alert alert-error shadow-lg mb-6">
          <span>{error}</span>
        </div>
      );
    }

    return children;
  };

  return (
    <LayoutComponent>
      {/* Use the PageTitle component instead of directly using Head */}
      <PageTitle
        title={title || (pageTitle ? pageTitle : "Dashboard")}
        description={description}
      />

      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className={`${maxWidth} mx-auto px-4 py-6`}>
        {!hideHeader && (pageTitle || pageSubtitle) && (
          <PageHeader
            title={pageTitle}
            subtitle={pageSubtitle}
            action={actionButton}
          />
        )}

        {renderContent()}
      </div>
    </LayoutComponent>
  );
};

export default PageLayout;
