"use client";
import React, { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import { useGlobalState } from "./context";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function FlashMsg() {
  const { msg, setMsg } = useGlobalState();
  const [currentMsg, setCurrentMsg] = useState(null);

  // console.log(msg);

  useEffect(() => {
    if (msg.length > 0 && !currentMsg) {
      // set currentMsg to the first item in queue
      const newMsg = msg[0]; // remove that msg from the queue
      const newArr = [...msg];
      newArr.shift(); // newArr now doesn't have msg
      setCurrentMsg(newMsg);
      setMsg(newArr);
    }
  }, [msg, currentMsg]);

  const handleClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setCurrentMsg(null); // clearing current msg
  };

  return (
    <Snackbar
      open={currentMsg ? true : false}
      autoHideDuration={1000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={currentMsg?.type}
        sx={{ width: "100%" }}
      >
        {currentMsg?.msg}
      </Alert>
    </Snackbar>
  );
}
