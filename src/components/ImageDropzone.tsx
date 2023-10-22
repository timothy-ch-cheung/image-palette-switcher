import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Dropzone, { FileRejection } from "react-dropzone";
import { useAlert } from "./AlertContext";
import ImageDisplay, { Dimensions, LoadedImage } from "./ImageDisplay";

const COMPATIBLE_TYPES = ["image/png", "image/jpeg"];
const DROP_SIZE = 45;
const IMG_SIZE = DROP_SIZE - 5;

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
  const [img, setImg] = useState<LoadedImage | undefined>(undefined);

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

      setImg({
        fileName: file.name,
        base64: base64Img,
        image: base64ToImageData(base64Img, dimensions),
        dimensions: dimensions,
      });

      img.onload = () => {
        const newDimensions = { width: img.width, height: img.height };
        setImg((prevState) => {
          if (prevState === undefined) {
            return undefined;
          } else {
            return {
              ...prevState,
              image: base64ToImageData(prevState.base64, newDimensions),
              dimensions: newDimensions,
            };
          }
        });
      };

      img.onerror = () => {
        console.log("Failed to load image:");
      };
    });
  };

  const imgSize = (window.innerHeight * IMG_SIZE) / 100;
  return (
    <Paper style={{ width: `${DROP_SIZE}vh`, height: `${DROP_SIZE}vh` }}>
      {img === undefined && (
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
                width: `${DROP_SIZE}vh`,
                height: `${DROP_SIZE}vh`,
                display: "flex",
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
      {img !== undefined && (
        <ImageDisplay
          img={img}
          dimensions={{ width: imgSize, height: imgSize }}
        />
      )}
    </Paper>
  );
}
