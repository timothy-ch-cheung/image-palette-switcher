import React, { useEffect, useRef, useState } from "react";
import Paper from "@mui/material/Paper";
import Dropzone, { FileRejection } from "react-dropzone";
import { useAlert } from "./AlertContext";
import ImageDisplay, { Dimensions } from "./ImageDisplay";
import { useSharedData } from "./DataProvider";

const COMPATIBLE_TYPES = ["image/png", "image/jpeg"];

function arrayBufferToBase64(buffer: ArrayBuffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToImageData(base64: string, dimensions: Dimensions): ImageData {
  if (dimensions.width === 0 && dimensions.height === 0) {
    return new ImageData(1, 1);
  }

  const image = new Image();
  image.src = base64;

  const canvas = document.createElement("canvas");
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;

  const ctx = canvas.getContext("2d");
  ctx?.drawImage(image, 0, 0, dimensions.width, dimensions.height);

  return (
    ctx?.getImageData(0, 0, canvas.width, canvas.height) || new ImageData(1, 1)
  );
}

export default function ImageDropzone() {
  const { showAlert } = useAlert();
  const { srcImage, replaceSrcImage, updateSrcImage } = useSharedData();
  const componentRef = useRef<HTMLDivElement | null>(null);
  const [imageSize, setImageSize] = useState<Dimensions>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (componentRef.current) {
      const RATIO = 0.9;
      setImageSize({
        width: componentRef.current.offsetWidth * RATIO,
        height: componentRef.current.offsetHeight * RATIO,
      });
    }
  }, []);

  const dropFailedHandler = (fileRejections: FileRejection[]) => {
    let messages = new Set(
      fileRejections
        .map((rejection: FileRejection) =>
          rejection.errors.map((error) => error.message)
        )
        .reduce(
          (accumulator, currentArray) => accumulator.concat(currentArray),
          []
        )
    );
    let message = Array.from(messages).join(", ");
    showAlert(message);
  };

  const dropSuccessHandler = (files: File[]) => {
    let file = files[0];
    file.arrayBuffer().then((buffer) => {
      const img = new Image();

      const base64Img = `data:${file.type};base64, ${arrayBufferToBase64(
        buffer
      )}`;

      img.src = base64Img;

      let dimensions = { width: img.width, height: img.height };

      replaceSrcImage({
        fileName: file.name,
        base64: base64Img,
        image: base64ToImageData(base64Img, dimensions),
        dimensions: dimensions,
      });

      img.onload = () => {
        const newDimensions = { width: img.width, height: img.height };
        updateSrcImage({
          image: base64ToImageData(base64Img, newDimensions),
          dimensions: newDimensions,
        });
      };

      img.onerror = () => {
        console.log("Failed to load image:");
      };
    });
  };

  return (
    <Paper
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: "0 0 auto",
      }}
      ref={componentRef}
    >
      {srcImage === undefined && (
        <Dropzone
          accept={{ COMPATIBLE_TYPES }}
          maxFiles={1}
          onDropRejected={dropFailedHandler}
          onDropAccepted={dropSuccessHandler}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <input {...getInputProps()} />
              <p>Drag 'n' drop, or click to select and image</p>
            </div>
          )}
        </Dropzone>
      )}
      {srcImage !== undefined && (
        <ImageDisplay
          img={srcImage}
          dimensions={{ width: imageSize.width, height: imageSize.height }}
        />
      )}
    </Paper>
  );
}
