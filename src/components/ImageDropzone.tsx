import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Dropzone, { FileRejection } from "react-dropzone";
import { useAlert } from "./AlertContext";
import ImageDisplay, { Dimensions, Image } from "./ImageDisplay";

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

export default function ImageDropzone() {
  const { showAlert } = useAlert();
  const [img, setImg] = useState<Image | undefined>(undefined);
  const [imgDimensions, setImageDimensions] = useState<Dimensions | undefined>(
    undefined
  );

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
    let file = files[0]
      file.arrayBuffer().then((buffer) => {
        setImg({
          fileName: file.name,
          base64: `data:${file.type};base64, ${arrayBufferToBase64(buffer)}`,
        });
      })
    }

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
      {img != null && (
        <ImageDisplay
          img={img}
          dimensions={{ width: imgSize, height: imgSize }}
        />
      )}
    </Paper>
  );
}
