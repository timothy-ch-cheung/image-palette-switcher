import { Paper } from "@mui/material";
import { useSharedData } from "./DataProvider";
import { StoredImage } from "./ImageDisplay";

const RESULT_SIZE = 50;

interface ResultDisplayProps {
  storedImage: StoredImage;
}
export function ResultDisplay(props: ResultDisplayProps) {
  const { targetDimensions, isPixelArt } = useSharedData();

  return (
    <Paper
      style={{
        width: `${RESULT_SIZE}vh`,
        height: `${RESULT_SIZE}vh`,
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
