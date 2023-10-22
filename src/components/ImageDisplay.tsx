import React, { useEffect, useState } from "react";

export interface LoadedImage {
  base64: string;
  image: ImageData;
  fileName: string;
  dimensions: Dimensions;
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
  console.log("Num Colours:", uniqueColors.size);
  return uniqueColors.size;
}

export default function ImageDisplay(props: ImageDisplayProps) {
  const [targetDimensions, setTargetDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });
  const [isPixelArt, setIsPixelArt] = useState<boolean>(false);

  useEffect(() => {
    setTargetDimensions(
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
    setIsPixelArt(numColours <= 256 && !isOverflowed);
  }, [props.dimensions, props.img.dimensions, props.img.image]);

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
