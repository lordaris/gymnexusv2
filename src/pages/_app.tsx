import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import ErrorBoundary from "../components/ui/errorBoundary";
import { AuthProvider } from "../contexts/AuthContext";
import { useEffect } from "react";

// Global error handler for uncaught promises
const initializeErrorHandlers = () => {
  if (typeof window !== "undefined") {
    window.addEventListener("unhandledrejection", (event) => {
      console.error("Unhandled Promise Rejection:", event.reason);
      // Optionally log to an error tracking service here
    });

    window.addEventListener("error", (event) => {
      console.error("Uncaught Error:", event.error);
      // Optionally log to an error tracking service here
    });
  }
};

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initializeErrorHandlers();
  }, []);

  return (
    <>
      <Head>
        <title>gymNEXUS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ErrorBoundary>
        <AuthProvider>
          <Component {...pageProps} />
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </AuthProvider>
      </ErrorBoundary>
    </>
  );
}
