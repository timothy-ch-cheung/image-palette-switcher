import { Chip, Paper } from "@mui/material";
import { useSharedData } from "./DataProvider";
import { useEffect, useReducer } from "react";
import { RGBColor } from "react-color";

function isLight(colour: RGBColor) {
  return Math.min(colour.r, colour.g, colour.b) >= 200;
}

export function PaletteDisplay() {
  const { palette } = useSharedData();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    forceUpdate();
  }, [palette]);

  return (
    <Paper style={{ minHeight: "10vh", width: "80vw", padding: "10px" }}>
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
            />
          );
        })}
      </div>
    </Paper>
  );
}
