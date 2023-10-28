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
import {
  APOLLO,
  CC29,
  INK,
  KIROKAZE_GAMEBOY,
  PEAR_36,
  SWEETIE_16,
} from "./Palette";

export interface PaletteColour {
  hex: string;
  rgb: RGBColor;
}

enum PalettePreset {
  NONE = "NONE",
  CC29 = "CC-29",
  APOLLO = "APOLLO",
  SWEETIE_16 = "SWEETIE 16",
  PEAR_36 = "PEAR 36",
  INK = "INK",
  KIROKAZE_GAMEBOY = "KIROKAZE GAMEBOY",
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
    case PalettePreset.SWEETIE_16:
      return getPresetPalette(SWEETIE_16);
    case PalettePreset.PEAR_36:
      return getPresetPalette(PEAR_36);
    case PalettePreset.INK:
      return getPresetPalette(INK);
    case PalettePreset.KIROKAZE_GAMEBOY:
      return getPresetPalette(KIROKAZE_GAMEBOY);
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
    const preset = event.target.value as PalettePreset;
    setSelectedPreset(preset);
    replacePalette(getPreset(preset));
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
        {Object.values(PalettePreset).map((palette) => (
          <MenuItem value={palette}>{palette}</MenuItem>
        ))}
      </Select>
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
