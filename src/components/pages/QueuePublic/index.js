import {
  Typography,
  Grid,
  ImageListItem,
  Box,
  Paper,
  Stack,
  Badge,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  BADGE_TURN_COLORS_MAP,
  TURN_STATUS,
  MAX_TURNS_TO_SHOW_PUBLIC,
} from "@utils/constants";

import {
  sortByProperty as sortArray,
  calculateAverageWaitingTime,
  getEstimatedTimeToBeAttended,
} from "@utils/helpers";

import LogoSinFondo from "@images/logo HRO sin fondo..png";
import LogoMSPAS from "@images/LOGO MSPAS.jpeg";

const QueuePublic = () => {
  const { user } = useSelector((state) => state.auth);
  const area = user?.area?.name;

  const lsTurns = localStorage.getItem("turns");
  const existingTurns = lsTurns !== "undefined" ? lsTurns || "[]" : "[]";
  const [turns, setTurns] = useState(JSON.parse(existingTurns));

  const onQueueTurns = sortArray(
    turns.filter((turn) => turn.status === TURN_STATUS.onQueue),
    "numero"
  );

  const onQueueTurnsLimited =
    onQueueTurns.length > MAX_TURNS_TO_SHOW_PUBLIC
      ? onQueueTurns.slice(0, MAX_TURNS_TO_SHOW_PUBLIC)
      : onQueueTurns;

  const notOnQueueTurns = sortArray(
    turns.filter((turn) => turn.status !== TURN_STATUS.onQueue),
    "updatedAt",
    "desc"
  );

  const notOnQueueTurnsLimited =
    notOnQueueTurns.length > MAX_TURNS_TO_SHOW_PUBLIC
      ? notOnQueueTurns.slice(0, MAX_TURNS_TO_SHOW_PUBLIC)
      : notOnQueueTurns;

  const avgWaitingTime = calculateAverageWaitingTime(notOnQueueTurns);

  // Define a function to handle changes in localStorage
  const handleLocalStorageChange = (e) => {
    // Handle the change, e.newValue contains the updated value
    console.log(`localStorage changed: ${e.newValue} ${e}`);
    if (e.key === "turns") {
      setTurns(JSON.parse(e.newValue));
    }
  };

  useEffect(() => {
    // Add an event listener for the 'storage' event on the window object
    window.addEventListener("storage", handleLocalStorageChange);
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("storage", handleLocalStorageChange);
    };
  }, []); // The empty dependency array ensures this effect runs only once on component mount

  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={12}
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Typography
          sx={{ fontWeight: "bold", marginLeft: "0.5rem" }}
          variant="h2"
        >
          Sala de espera {area || ""}
        </Typography>
        <ImageListItem key={LogoSinFondo} sx={{ maxWidth: "500px" }}>
          <img src={LogoSinFondo} alt="logo sin fondo" />
        </ImageListItem>
      </Grid>
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={6}>
            <Box sx={{ flexGrow: 1, overflow: "hidden", px: 3 }}>
              <Typography noWrap variant="h4">
                <strong>Proximos turnos</strong>
              </Typography>
              {onQueueTurnsLimited.map((turn, index) => (
                <Paper
                  sx={{
                    my: 1,
                    mx: "auto",
                    p: 0.5,
                  }}
                  key={turn._id}
                >
                  <Stack spacing={2} direction="row" alignItems="center">
                    <Stack
                      sx={{
                        minWidth: 0,
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "row",
                      }}
                    >
                      <Typography noWrap variant="h4">
                        <strong>{turn.numero}</strong> - {turn.nombres || ""}{" "}
                        {turn.apellidos || ""}
                      </Typography>
                      <Typography sx={{ marginLeft: "3rem" }} variant="h4">
                        {getEstimatedTimeToBeAttended(
                          index + 1,
                          avgWaitingTime
                        )}
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                flexGrow: 1,
                overflow: "hidden",
                px: 3,
                borderLeft: "2px solid grey",
              }}
            >
              <Typography noWrap variant="h4">
                <strong>Ultimos llamados</strong>
              </Typography>
              {notOnQueueTurnsLimited.map((turn) => (
                <Paper
                  sx={{
                    my: 1,
                    mx: "auto",
                    p: 0.5,
                    backgroundColor: "#fff",
                  }}
                  key={turn._id}
                >
                  <Badge
                    color={BADGE_TURN_COLORS_MAP[turn.status]}
                    badgeContent={turn.status}
                    sx={{ marginRight: "1rem" }}
                  >
                    <Stack spacing={2} direction="row" alignItems="center">
                      <Stack sx={{ minWidth: 0 }}>
                        <Typography noWrap variant="h4">
                          <strong>{turn.numero}</strong> - {turn.nombres || ""}{" "}
                          {turn.apellidos || ""}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Badge>
                </Paper>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ color: "red", position: "fixed", bottom: 0, width: "100%" }}
      >
        <Grid container>
          <Grid item xs={6}>
            <ImageListItem key={LogoMSPAS}>
              <img
                src={LogoMSPAS}
                alt="logo footer"
                style={{ width: "auto", height: "auto" }}
              />
            </ImageListItem>
          </Grid>
          <Grid item xs={6} textAlign={"right"}>
            <Typography variant="h3">
              <strong>Tiempo de espera promedio por turno</strong>
            </Typography>
            <Typography variant="h3">
              <strong>
                {(Number(avgWaitingTime) / (1000 * 60)).toFixed()} minutos
              </strong>
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default QueuePublic;
