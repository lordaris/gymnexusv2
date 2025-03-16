// src/components/ui/dashboardLayout.js
import React, { useState } from "react";
import { Card } from "./card";
import { PageLayout } from "./pageLayout";
import { Button } from "./button";
import Link from "next/link";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

// Dashboard action button component
export const DashboardAction = ({ label, href, icon, onClick }) => {
  const buttonContent = (
    <Button
      variant="primary"
      size="lg"
      fullWidth
      icon={icon}
      onClick={onClick}
      className="shadow-sm hover:shadow-md"
    >
      {label}
    </Button>
  );

  if (href) {
    return <Link href={href}>{buttonContent}</Link>;
  }

  return buttonContent;
};

// Dashboard section component
export const DashboardSection = ({
  title,
  children,
  action,
  className = "",
  isLoading = false,
  collapsible = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (collapsible) {
    return (
      <Card className={`mb-8 ${className}`} isLoading={isLoading}>
        <div className="flex justify-between items-center p-4 border-b border-base-300">
          <h2 className="text-xl font-semibold">{title}</h2>
          <div className="flex items-center gap-2">
            {action}
            <Button
              variant="ghost"
              size="sm"
              icon={isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
              onClick={() => setIsCollapsed(!isCollapsed)}
            />
          </div>
        </div>
        {!isCollapsed && <div className="p-4">{children}</div>}
      </Card>
    );
  }

  return (
    <Card
      title={title}
      actionButton={action}
      className={`mb-8 ${className}`}
      isLoading={isLoading}
    >
      {children}
    </Card>
  );
};

// Stats card component
export const StatCard = ({
  title,
  value,
  icon,
  link,
  linkText = "View details",
  change,
  changeLabel,
  isLoading = false,
}) => {
  // Determine color based on change (positive or negative)
  const changeColor =
    change > 0
      ? "text-success"
      : change < 0
      ? "text-error"
      : "text-base-content/60";
  const changeSymbol = change > 0 ? "+" : "";

  if (isLoading) {
    return (
      <Card className="h-32 animate-pulse">
        <div className="h-6 bg-base-300 rounded w-1/3 mb-2"></div>
        <div className="h-8 bg-base-300 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-base-300 rounded w-1/4"></div>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-base font-medium text-base-content/70">
            {title}
          </h3>
          <p className="text-3xl font-bold mt-1">{value}</p>

          {change !== undefined && change !== null && (
            <p className={`text-sm mt-1 ${changeColor}`}>
              <span>
                {changeSymbol}
                {change}%
              </span>
              {changeLabel && (
                <span className="text-base-content/60 ml-1">{changeLabel}</span>
              )}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2 bg-base-300 rounded-lg text-primary">{icon}</div>
        )}
      </div>

      {link && (
        <div className="mt-4 text-sm">
          <Link href={link} className="text-primary hover:underline">
            {linkText} →
          </Link>
        </div>
      )}
    </Card>
  );
};

// Dashboard grid layout
export const DashboardGrid = ({
  children,
  cols = { sm: 1, md: 2, lg: 3 },
  gap = 4,
  className = "",
}) => {
  const colClasses = `grid grid-cols-1 ${
    cols.sm ? `sm:grid-cols-${cols.sm}` : ""
  } ${cols.md ? `md:grid-cols-${cols.md}` : ""} ${
    cols.lg ? `lg:grid-cols-${cols.lg}` : ""
  }`;

  return (
    <div className={`${colClasses} gap-${gap} ${className}`}>{children}</div>
  );
};

// Main dashboard layout
export const DashboardLayout = ({
  title = "Dashboard",
  subtitle,
  actions = [],
  stats = [],
  children,
  isLoading = false,
}) => {
  return (
    <PageLayout pageTitle={title} pageSubtitle={subtitle} isLoading={isLoading}>
      {/* Quick Actions */}
      {actions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {actions.map((action, index) => (
            <DashboardAction
              key={index}
              label={action.label}
              href={action.href}
              icon={action.icon}
              onClick={action.onClick}
            />
          ))}
        </div>
      )}

      {/* Stats Cards */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              link={stat.link}
              linkText={stat.linkText}
              change={stat.change}
              changeLabel={stat.changeLabel}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      {children}
    </PageLayout>
  );
};

export default DashboardLayout;
