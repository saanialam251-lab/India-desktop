import React from "react"; import ReactDOM from "react-dom/client";
import App from "./App.jsx"; import "./styles/index.css";
import { restoreSquads } from "./utils/storage";
// Render immediately — never wait on native storage, or a slow/hung call leaves a blank screen.
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
Promise.race([restoreSquads(), new Promise(r => setTimeout(r, 3000))]).catch(() => {});
