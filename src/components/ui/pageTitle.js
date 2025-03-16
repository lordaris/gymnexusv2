import React from "react";
import Head from "next/head";

/**
 * PageTitle component for consistent page titles across the application
 *
 * This component properly handles title element by ensuring it only receives
 * a single text node as children, fixing the hydration warnings.
 *
 * @param {string} title - The main page title
 * @param {string} suffix - Optional suffix to append (defaults to "gymNEXUS")
 * @param {boolean} includeSuffix - Whether to include the suffix (defaults to true)
 * @param {string} separator - Separator between title and suffix (defaults to " | ")
 */
export const PageTitle = ({
  title,
  suffix = "gymNEXUS",
  includeSuffix = true,
  separator = " | ",
  description,
}) => {
  // Create a single text node for the title
  const fullTitle = includeSuffix ? `${title}${separator}${suffix}` : title;

  return (
    <Head>
      <title key="page-title">{fullTitle}</title>
      {description && <meta name="description" content={description} />}
    </Head>
  );
};

export default PageTitle;
