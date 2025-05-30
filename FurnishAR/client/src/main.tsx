import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Safety check for any replit global references
if (typeof window !== 'undefined') {
  // Ensure no undefined global references cause issues
  (window as any).global = window;
}

createRoot(document.getElementById("root")!).render(<App />);