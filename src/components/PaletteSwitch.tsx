import {
  Button,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { useSharedData } from "./DataProvider";
import { LoadedImage } from "./ImageDisplay";
import { PaletteColour } from "./PaletteSelecter";

export enum Algorithm {
  COLOUR_SIMILARITY = "Colour Similarity",
  SHADE_SIMILARITY = "Shade Similarity",
}

interface PaletteSwitcherProps {
  switchPalette: (
    loadedImage: LoadedImage | undefined,
    palette: PaletteColour[],
    algorithm: Algorithm
  ) => void;
  reset: () => void;
}

export function PaletteSwitcher(props: PaletteSwitcherProps) {
  const { srcImage, replaceSrcImage, palette } =
    useSharedData();
  const [algorithm, setAlgorithm] = useState<Algorithm>(
    Algorithm.COLOUR_SIMILARITY
  );

  const algorithmChangeHandler = (event: SelectChangeEvent) => {
    setAlgorithm(event.target.value as Algorithm);
  };

  const resetImages = () => {
    replaceSrcImage(undefined);
    props.reset();
  };

  return (
    <Paper
      style={{
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={algorithm}
        label="Age"
        onChange={algorithmChangeHandler}
      >
        <MenuItem value={Algorithm.COLOUR_SIMILARITY}>
          {Algorithm.COLOUR_SIMILARITY}
        </MenuItem>
        <MenuItem value={Algorithm.SHADE_SIMILARITY}>
          {Algorithm.SHADE_SIMILARITY}
        </MenuItem>
      </Select>
      <Button
        variant="contained"
        color="primary"
        sx={{ height: "60px", fontWeight: "bold" }}
        onClick={() => {
          console.log(srcImage?.base64, palette);
          props.switchPalette(srcImage, palette, algorithm);
        }}
      >
        Convert
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          resetImages();
        }}
      >
        Reset Images
      </Button>
    </Paper>
  );
}
