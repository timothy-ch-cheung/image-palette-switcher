import {
  Button,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";

enum Algorithm {
  COLOUR_SIMILARITY = "Colour Similarity",
  SHADE_SIMILARITY = "Shade Similarity",
}

export function PaletteSwitcher() {
  const [algorithm, setAlgorithm] = useState<Algorithm>(
    Algorithm.COLOUR_SIMILARITY
  );

  const algorithmChangeHandler = (event: SelectChangeEvent) => {
    setAlgorithm(event.target.value as Algorithm);
  };

  return (
    <Paper
      style={{
        minHeight: "10vh",
        width: "20vw",
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
        onClick={() => {}}
      >
        Convert
      </Button>
    </Paper>
  );
}
