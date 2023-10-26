import { Paper } from "@mui/material";

const RESULT_SIZE = 50;

export function ResultDisplay() {
  return (
    <Paper
      style={{ width: `${RESULT_SIZE}vh`, height: `${RESULT_SIZE}vh` }}
    ></Paper>
  );
}
