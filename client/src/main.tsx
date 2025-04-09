import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set title
document.title = 'FitTrack - Fitness Progress Tracker';

// Add a meta tag for description
const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = 'Track your fitness progress with FitTrack - your fitness journey companion';
document.head.appendChild(metaDescription);

createRoot(document.getElementById("root")!).render(<App />);
