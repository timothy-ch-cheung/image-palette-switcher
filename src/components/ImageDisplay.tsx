import React, { useEffect, useState } from "react";

export interface Image {
  base64: string;
  fileName: string;
}

export interface Dimensions {
  width: number;
  height: number;
}

interface ImageDisplayProps {
  img: Image;
  dimensions: Dimensions;
}

function doesImageOverflowWindow(
  srcDimensions: Dimensions,
  windowDimensions: Dimensions
) {
  return (
    srcDimensions.width < windowDimensions.width &&
    srcDimensions.height < windowDimensions.height
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
  if (isPixelArt) {
    scale = Math.floor(scale);
  }
  console.log(scale);
  return {
    width: srcDimensions.width * scale,
    height: srcDimensions.height * scale,
  };
}

export default function ImageDisplay(props: ImageDisplayProps) {
  const [srcDimensions, setSrcDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });
  const [targetDimensions, setTargetDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });
  const [isPixelArt, setIsPixelArt] = useState<boolean>(false);

  useEffect(() => {
    const img = new Image();
    img.src = props.img.base64;

    if (img.complete) {
      setSrcDimensions({ width: img.width, height: img.height });
    }

    img.onload = () => {
      setSrcDimensions({ width: img.width, height: img.height });
    };
  }, [props.img.base64]);

  useEffect(() => {
    setTargetDimensions(
      calculateScaledDimensions(
        false,
        { width: srcDimensions.width, height: srcDimensions.height },
        props.dimensions
      )
    );
  }, [props.dimensions, srcDimensions]);

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
