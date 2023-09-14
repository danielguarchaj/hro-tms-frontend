import React from "react";
import Button from "@mui/material/Button";

const AtomicButton = ({
  label,
  onClick,
  customClassName = "",
  size = "medium",
  disabled = false,
}) => {
  return (
    <Button
      variant="contained"
      color="primary"
      size={size}
      onClick={onClick}
      className={customClassName}
      disabled={disabled}
    >
      {label}
    </Button>
  );
};

export default AtomicButton;
