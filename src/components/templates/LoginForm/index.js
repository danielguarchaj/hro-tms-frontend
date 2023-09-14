import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { APP_URLS } from "@routes";
import { updateInput, getAccessToken } from "@redux/reducers/auth";

import TextField from "@mui/material/TextField";
import Button from "@atoms/Button";
import { Typography } from "@mui/material";

import "./index.css";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { username, password, token, tokenStatus, sessionExpired } =
    useSelector((state) => state.auth);

  useEffect(() => {
    if (token && tokenStatus === "succeeded" && !sessionExpired) {
      return navigate(APP_URLS.admin);
    }
    // if (tokenStatus === "failed") {
    //   toastInstance.dismiss();
    //   toastErrorLogin();
    // }
  }, [token, tokenStatus, sessionExpired, navigate]);

  const disableSubmit = false;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(getAccessToken({ username, password }));
  };

  const handleChange = (field, value) => {
    dispatch(updateInput({ field, value }));
  };

  return (
    <div className="login-container">
      <form
        className="login-form"
        noValidate="novalidate"
        onSubmit={(e) => handleSubmit(e)}
        disabled={disableSubmit}
      >
        <Typography variant="h4">
          Bienvenido al sistema de gestion de turnos
        </Typography>
        <TextField
          label="Usuario"
          value={username}
          onChange={(e) => handleChange("username", e.target.value)}
          variant="outlined"
          fullWidth
          className="login-form__custom-button"
          margin="dense"
          type="text"
          disabled={disableSubmit}
        />
        <TextField
          label="Usuario"
          value={password}
          onChange={(e) => handleChange("password", e.target.value)}
          variant="outlined"
          fullWidth
          className="login-form__custom-button"
          margin="dense"
          type="password"
          disabled={disableSubmit}
        />
        <Button
          type="button"
          color="primary"
          customClassName="login-form__custom-button"
          label="Iniciar Sesion"
          size="large"
          onClick={() => dispatch(getAccessToken({ username, password }))}
          disabled={disableSubmit}
        />
      </form>
    </div>
  );
};

export default LoginForm;
