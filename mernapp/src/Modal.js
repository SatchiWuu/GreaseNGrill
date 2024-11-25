import React from "react";
import ReactDOM from "react-dom";
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

export default function Modal({ children, onClose, open }) {
  // Ensure the portal target exists
  const portalRoot = document.getElementById("cart-root");
  if (!portalRoot) {
    console.error("Portal root element 'cart-root' not found!");
    return null;
  }

  return ReactDOM.createPortal(
    <>
      {/* Modal using MUI Dialog component */}
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        sx={{
          backgroundColor: "rgb(34, 34, 34)",
          color: "white",
          borderRadius: 2,
          padding: 2,
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Close button */}
          <span>Cart</span>
          <IconButton onClick={onClose} sx={{ color: "black" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: 2 }}>
          {/* Render children */}
          {children}
        </DialogContent>
        <DialogActions sx={{ padding: 1 }}>
          {/* You can add action buttons here if needed */}
        </DialogActions>
      </Dialog>
    </>,
    portalRoot
  );
}