import * as React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { APP_URLS } from "@routes";
import {
  updateInput,
  getAccessToken,
  setShowErrorSnackbar,
} from "@redux/reducers/auth";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Alert,
  Snackbar,
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import ImageSide from "../../../assets/images/MSPASHRO.jpeg";

const defaultTheme = createTheme();

export default function SignInSide() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    username,
    password,
    token,
    tokenStatus,
    sessionExpired,
    showErrorSnackbar,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && tokenStatus === "succeeded" && !sessionExpired) {
      return navigate(APP_URLS.admin);
    }
    // if (tokenStatus === "failed") {
    //   toastInstance.dismiss();
    //   toastErrorLogin();
    // }
  }, [token, tokenStatus, sessionExpired, navigate]);

  const disableSubmit = tokenStatus === "loading";

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(getAccessToken({ username, password }));
  };

  const handleChange = (field, value) => {
    dispatch(updateInput({ field, value }));
  };

  const handleCloseSnackbar = () => {
    dispatch(setShowErrorSnackbar(false));
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${ImageSide})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h4">
              SISTEMA DE GESTIÓN DE TURNOS
            </Typography>
            <form onSubmit={handleSubmit}>
              <Box sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Usuario"
                  name="username"
                  autoFocus
                  value={username}
                  onChange={(e) => handleChange("username", e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  disabled={disableSubmit}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  size="large"
                  disabled={disableSubmit}
                >
                  Iniciar Sesion
                </Button>
              </Box>
            </form>
            <Snackbar
              open={showErrorSnackbar}
              autoHideDuration={5000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <Alert
                onClose={handleCloseSnackbar}
                severity="error"
                sx={{ width: "100%" }}
                variant="filled"
              >
                Credenciales invalidas, intente de nuevo
              </Alert>
            </Snackbar>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
