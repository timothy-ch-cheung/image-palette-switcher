import React from "react";
import Paper from "@mui/material/Paper";
import Dropzone, { FileRejection } from "react-dropzone";
import { useAlert } from "./AlertContext";

const COMPATIBLE_TYPES = ["image/png", "image/jpeg"];

export default function DropzoneBox() {
  const { showAlert } = useAlert();

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

  return (
    <Dropzone
      accept={{ COMPATIBLE_TYPES }}
      maxFiles={1}
      onDropRejected={dropFailedHandler}
    >
      {({ getRootProps, getInputProps }) => (
        <Paper
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
        </Paper>
      )}
    </Dropzone>
  );
}
