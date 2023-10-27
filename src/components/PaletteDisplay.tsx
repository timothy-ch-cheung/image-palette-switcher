import { Chip, Paper } from "@mui/material";
import { useSharedData } from "./DataProvider";
import { RGBColor } from "react-color";

function isLight(colour: RGBColor) {
  return Math.min(colour.r, colour.g, colour.b) >= 175;
}

export function PaletteDisplay() {
  const { palette, replacePalette } = useSharedData();

  return (
    <Paper style={{ minHeight: "10vh", width: "70vw", padding: "10px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          maxWidth: "80vw",
          justifyContent: "start",
          gap: "10px",
        }}
      >
        {palette.map(function (colour, index) {
          return (
            <Chip
              label={colour.hex}
              style={{
                backgroundColor: colour.hex,
                color: isLight(colour.rgb) ? "#000" : "#fff",
              }}
              onDelete={() => {
                const newPalette = [...palette];
                newPalette.splice(index, 1);
                replacePalette(newPalette);
              }}
            />
          );
        })}
      </div>
    </Paper>
  );
}
