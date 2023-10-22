import React from "react";
import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import DropzoneBox from "./components/DropzoneBox";
import { AlertProvider } from "./components/AlertContext";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AlertProvider>
        <div className="App">
          <DropzoneBox />
        </div>
      </AlertProvider>
    </ThemeProvider>
  );
}

export default App;
