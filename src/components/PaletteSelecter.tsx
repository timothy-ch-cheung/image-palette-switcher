import {
  Button,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React, { useState } from "react";
import { ColorResult, RGBColor, SketchPicker } from "react-color";
import { useSharedData } from "./DataProvider";
import chroma from "chroma-js";
import { APOLLO, CC29 } from "./Palette";

export interface PaletteColour {
  hex: string;
  rgb: RGBColor;
}

enum PalettePreset {
  NONE = "NONE",
  CC29 = "CC-29",
  APOLLO = "APOLLO",
}

function getPresetPalette(colours: string[]): PaletteColour[] {
  return colours.map((colour) => {
    const [r, g, b] = chroma(colour).rgb();
    return { hex: colour, rgb: { r: r, g: g, b: b } };
  });
}

function getPreset(preset: PalettePreset): PaletteColour[] {
  switch (preset) {
    case PalettePreset.CC29:
      return getPresetPalette(CC29);
    case PalettePreset.APOLLO:
      return getPresetPalette(APOLLO);
    default:
      return [];
  }
}

export function PaletteSelecter() {
  const { replacePalette, addToPalette } = useSharedData();
  const [currentColour, setCurrentColour] = useState<PaletteColour>({
    hex: "#ffffff",
    rgb: { r: 255, g: 255, b: 255, a: 100 },
  });
  const [selectedPreset, setSelectedPreset] = useState<PalettePreset>(
    PalettePreset.NONE
  );

  const colourChangeHandler = (color: ColorResult) => {
    setCurrentColour({
      hex: color.hex,
      rgb: color.rgb,
    });
  };

  const addToPaletteHandler = (event: React.MouseEvent<HTMLElement>) => {
    addToPalette(currentColour);
  };

  const presetChangeHandler = (event: SelectChangeEvent) => {
    setSelectedPreset(event.target.value as PalettePreset);
  };

  const loadPalettePresetHandler = () => {
    replacePalette(getPreset(selectedPreset));
  };

  const clearPaletteHandler = () => {
    replacePalette([]);
  };

  return (
    <Paper
      style={{
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
      }}
    >
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={selectedPreset}
        label="Age"
        onChange={presetChangeHandler}
      >
        <MenuItem value={PalettePreset.NONE}>{PalettePreset.NONE}</MenuItem>
        <MenuItem value={PalettePreset.CC29}>{PalettePreset.CC29}</MenuItem>
        <MenuItem value={PalettePreset.APOLLO}>{PalettePreset.APOLLO}</MenuItem>
      </Select>
      <Button
        variant="contained"
        color="secondary"
        onClick={loadPalettePresetHandler}
        disabled={selectedPreset === PalettePreset.NONE}
      >
        Load Preset
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={clearPaletteHandler}
      >
        Clear
      </Button>
      <SketchPicker
        color={currentColour.hex}
        onChange={colourChangeHandler}
        width="calc(100% - 20px)"
      ></SketchPicker>
      <Button
        variant="contained"
        color="secondary"
        onClick={addToPaletteHandler}
      >
        Add Colour
      </Button>
    </Paper>
  );
}
