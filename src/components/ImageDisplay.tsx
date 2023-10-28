import React, { useEffect } from "react";
import { useSharedData } from "./DataProvider";

export interface StoredImage {
  base64: string;
  dimensions: Dimensions;
}

export interface LoadedImage extends StoredImage {
  image: ImageData;
  fileName: string;
}

export interface Dimensions {
  width: number;
  height: number;
}

interface ImageDisplayProps {
  img: LoadedImage;
  dimensions: Dimensions;
}

function doesImageOverflowWindow(
  srcDimensions: Dimensions,
  windowDimensions: Dimensions
) {
  return (
    srcDimensions.width > windowDimensions.width ||
    srcDimensions.height > windowDimensions.height
  );
}

function calculateScaledDimensions(
  isPixelArt: boolean,
  srcDimensions: Dimensions,
  windowDimensions: Dimensions
) {
  let scaleX = windowDimensions.width / srcDimensions.width;
  let scaleY = windowDimensions.height / srcDimensions.height;
  let scale = Math.min(scaleX, scaleY);
  scale = Number.isNaN(scale) ? 1 : scale;
  if (isPixelArt) {
    scale = Math.floor(scale);
  }
  return {
    width: srcDimensions.width * scale,
    height: srcDimensions.height * scale,
  };
}

function countUniqueColours(img: ImageData) {
  const uniqueColors = new Set();

  const estimate = img.data.length > 512 ** 2;
  const pixelsToCheck = Math.floor(img.data.length / 10 ** 3);

  for (let i = 0; i < img.data.length; i += 4) {
    if (estimate && !(i % pixelsToCheck === 0)) {
      continue;
    }
    const r = img.data[i];
    const g = img.data[i + 1];
    const b = img.data[i + 2];
    const hexColor = `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    uniqueColors.add(hexColor);
  }
  return uniqueColors.size;
}

export default function ImageDisplay(props: ImageDisplayProps) {
  const {
    targetDimensions,
    updateTargetDimensions,
    isPixelArt,
    updateIsPixelArt,
  } = useSharedData();

  useEffect(() => {
    updateTargetDimensions(
      calculateScaledDimensions(
        isPixelArt,
        {
          width: props.img.dimensions.width,
          height: props.img.dimensions.height,
        },
        props.dimensions
      )
    );
  }, [
    isPixelArt,
    props.dimensions,
    props.img.dimensions.height,
    props.img.dimensions.width,
  ]);

  useEffect(() => {
    const numColours = countUniqueColours(props.img.image);
    const isOverflowed = doesImageOverflowWindow(
      props.img.dimensions,
      props.dimensions
    );
    updateIsPixelArt(numColours <= 256 && !isOverflowed);
  }, [
    props.dimensions,
    props.img.dimensions,
    props.img.image,
    updateIsPixelArt,
  ]);

  return (
    <div>
      <img
        src={props.img?.base64}
        alt={props.img?.fileName}
        style={{
          width: targetDimensions.width,
          height: targetDimensions.height,
          imageRendering: isPixelArt ? "pixelated" : "auto",
        }}
      />
    </div>
  );
}
