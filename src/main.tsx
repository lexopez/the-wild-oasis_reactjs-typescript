import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/ErrorFallback";

// 1. Ensure the root element exists to satisfy TypeScript's null-safety
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element. Check your index.html.");
}

// 2. Initialize the root with the confirmed non-null element
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    {/* 3. The ErrorBoundary wraps the entire App for global error catching */}
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.replace("/")}
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
