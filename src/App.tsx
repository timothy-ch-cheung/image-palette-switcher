import React from "react";
import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ImageDropzone from "./components/ImageDropzone";
import { AlertProvider } from "./components/AlertContext";
import { DataProvider } from "./components/DataProvider";
import { PaletteSelecter } from "./components/PaletteSelecter";
import { ResultDisplay } from "./components/ResultDisplay";
import { PaletteDisplay } from "./components/PaletteDisplay";

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
        <DataProvider>
          <div className="App">
            <div className="MainPanel">
              <PaletteSelecter />
              <ImageDropzone />
              <ResultDisplay />
            </div>
            <PaletteDisplay />
          </div>
        </DataProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}

export default App;
