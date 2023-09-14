import TextField from "@mui/material/TextField";

const Input = ({
  label,
  value,
  onChange,
  variant = "outlined",
  customClassName = "",
  type = "text",
}) => {
  const handleChange = (event) => {
    if (onChange) {
      onChange();
    }
  };

  return (
    <TextField
      label={label}
      value={value}
      onChange={handleChange}
      variant={variant}
      fullWidth
      className={customClassName}
      margin="dense"
      type={type}
    />
  );
};

export default Input;
