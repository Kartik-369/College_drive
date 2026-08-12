import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { StyledEngineProvider } from "@mui/material/styles";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import { StyledEngineProvider } from '@mui/material'

createRoot(document.getElementById("root")).render(
  <StyledEngineProvider>
    <StrictMode>
      <GoogleOAuthProvider clientId="512413607874-ibj6ud3uvnh5074h0g2q59uak87nu53p.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </StrictMode>
  </StyledEngineProvider>,
);
