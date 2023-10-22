import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Dropzone, { FileRejection } from "react-dropzone";
import { useAlert } from "./AlertContext";

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

export default function ImageDropzone() {
  const { showAlert } = useAlert();
  const [img, setImg] = useState<string | undefined>(undefined);

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
    files.forEach((file: File) => {
      console.log(file.name);
      file.arrayBuffer().then((buffer) => {
        setImg(`data:${file.type};base64, ` + arrayBufferToBase64(buffer));
      });
    });
  };

  return (
    <Paper style={{ width: "45vh", height: "45vh" }}>
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
                width: "45vh",
                height: "45vh",
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
      {img != null && <img src={img} alt="user supplied" />}
    </Paper>
  );
}
