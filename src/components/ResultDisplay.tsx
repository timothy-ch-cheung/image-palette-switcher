import { Paper } from "@mui/material";
import { useSharedData } from "./DataProvider";
import { StoredImage } from "./ImageDisplay";


interface ResultDisplayProps {
  storedImage: StoredImage;
}
export function ResultDisplay(props: ResultDisplayProps) {
  const { targetDimensions, isPixelArt } = useSharedData();

  return (
    <Paper
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={props.storedImage.base64}
        alt="generated"
        style={{
          width: targetDimensions.width,
          height: targetDimensions.height,
          imageRendering: isPixelArt ? "pixelated" : "auto",
        }}
      ></img>
    </Paper>
  );
}
