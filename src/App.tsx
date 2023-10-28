import React, { useState } from "react";
import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ImageDropzone from "./components/ImageDropzone";
import { AlertProvider } from "./components/AlertContext";
import { DataProvider } from "./components/DataProvider";
import { PaletteColour, PaletteSelecter } from "./components/PaletteSelecter";
import { ResultDisplay } from "./components/ResultDisplay";
import { PaletteDisplay } from "./components/PaletteDisplay";
import { Algorithm, PaletteSwitcher } from "./components/PaletteSwitch";
import { LoadedImage, StoredImage } from "./components/ImageDisplay";
import { RGBColor } from "react-color";
import chroma from "chroma-js";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const TRANSPARENT_PLACEHOLDER =
  "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

const TRANSPARENT_PLACEHOLDER_IMG = {
  base64: TRANSPARENT_PLACEHOLDER,
  dimensions: { width: 0, height: 0 },
};

function getConversionFunction(
  algorithm: Algorithm
): (colour: RGBColor, palette: PaletteColour[]) => RGBColor {
  switch (algorithm) {
    case Algorithm.COLOUR_SIMILARITY: {
      return convertUsingColourSimilarity;
    }
    case Algorithm.SHADE_SIMILARITY: {
      return convertUsingShadeSimilarity;
    }
  }
}

function rgbToString(colour: RGBColor): string {
  return `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`;
}

function switchColourPalette(
  loadedImage: LoadedImage | undefined,
  palette: PaletteColour[],
  algorithm: Algorithm
): StoredImage {
  if (loadedImage == null) {
    console.log("Loaded image is null");
    return TRANSPARENT_PLACEHOLDER_IMG;
  }
  const conversionFunction = getConversionFunction(algorithm);
  const canvas = document.createElement("canvas");
  canvas.width = loadedImage.dimensions.width;
  canvas.height = loadedImage.dimensions.height;
  const ctx = canvas.getContext("2d");

  if (ctx == null) {
    console.log("Canvas context is null");
    return TRANSPARENT_PLACEHOLDER_IMG;
  }

  ctx.putImageData(loadedImage.image, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const colourMapping = new Map<string, RGBColor>();
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const index = (y * canvas.width + x) * 4;

      const red = imageData.data[index];
      const green = imageData.data[index + 1];
      const blue = imageData.data[index + 2];

      const currentColour = { r: red, g: green, b: blue };
      const colourKey = rgbToString(currentColour);
      let convertedColour = colourMapping.get(colourKey);
      if (convertedColour == null) {
        convertedColour = conversionFunction(currentColour, palette);
        colourMapping.set(colourKey, convertedColour);
      }

      imageData.data[index] = convertedColour.r;
      imageData.data[index + 1] = convertedColour.g;
      imageData.data[index + 2] = convertedColour.b;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  return {
    base64: canvas.toDataURL(),
    dimensions: { width: canvas.width, height: canvas.height },
  };
}

function convertUsingColourSimilarity(
  colour: RGBColor,
  palette: PaletteColour[]
): RGBColor {
  const srcColour = chroma.rgb(colour.r, colour.g, colour.b);
  let bestColour: RGBColor = palette[0].rgb;
  let bestDetla = 100;
  for (let colour of palette) {
    const delta = chroma.deltaE(srcColour, colour.hex);
    if (chroma.deltaE(srcColour, colour.hex) < bestDetla) {
      bestColour = colour.rgb;
      bestDetla = delta;
    }
  }
  return bestColour;
}

function convertUsingShadeSimilarity(
  colour: RGBColor,
  palette: PaletteColour[]
): RGBColor {
  const srcLuminance = chroma.rgb(colour.r, colour.g, colour.b).luminance();
  let bestColour: RGBColor = palette[0].rgb;
  let bestDetla = 100;
  for (let colour of palette) {
    const currentLuminance = chroma(colour.hex).luminance();
    const luminanceDifference = Math.abs(srcLuminance - currentLuminance);
    const percentageDifference =
      (luminanceDifference / Math.max(srcLuminance, currentLuminance)) * 100;
    if (percentageDifference < bestDetla) {
      bestColour = colour.rgb;
      bestDetla = percentageDifference;
    }
  }
  return bestColour;
}

function App() {
  const [convertedImage, setConvertedImage] = useState<StoredImage>(
    TRANSPARENT_PLACEHOLDER_IMG
  );
  const switchPalette = (
    srcImg: LoadedImage | undefined,
    palette: PaletteColour[],
    algorithm: Algorithm
  ) => {
    setConvertedImage(switchColourPalette(srcImg, palette, algorithm));
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AlertProvider>
        <DataProvider>
          <div className="App">
            <div className="MainPanel">
              <PaletteSelecter />
              <ImageDropzone />
              <ResultDisplay storedImage={convertedImage} />
            </div>
            <div className="MainPanel">
              <PaletteSwitcher switchPalette={switchPalette} />
              <PaletteDisplay />
            </div>
          </div>
        </DataProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}

export default App;
