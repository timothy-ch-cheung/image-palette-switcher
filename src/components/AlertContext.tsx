import { Alert, Collapse } from "@mui/material";
import React, { createContext, useContext, useState } from "react";

type AlertContextType = {
  isVisible: boolean;
  message: string;
  showAlert: (message: string) => void;
};

const AlertContext = createContext<AlertContextType>({
    isVisible: false,
    message: "",
    showAlert: () => {}
});

export function useAlert() {
  return useContext(AlertContext);
}

interface AlertProviderProps {
  children: React.ReactNode;
}

export function AlertProvider(props: AlertProviderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");

  const showAlert = (message: string) => {
    setMessage(message);
    setIsVisible(true);
    setTimeout(() => setIsVisible(false), 2000);
  };

  const value: AlertContextType = {
    isVisible,
    message,
    showAlert,
  };

  return (
    <AlertContext.Provider value={value}>
        <Collapse in={isVisible}>
          <Alert severity="error" style={{ position: "absolute", width: "75vw", left: "12.5%", top: "2.5%"}}>
            {message}
          </Alert>
        </Collapse>
      {props.children}
    </AlertContext.Provider>
  );
}
