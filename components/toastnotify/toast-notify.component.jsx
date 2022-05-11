import React, { ReactFragment } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import "./toast-notify.styles.scss";

function ToastNotify({ position }) {
  return (
    <>
      <ToastContainer
        position={position}
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default ToastNotify;
