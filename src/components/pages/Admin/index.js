import { useSelector, useDispatch } from "react-redux";

import SwipeableViews from "react-swipeable-views";

import AddToQueue from "@mui/icons-material/AddToQueue";
import EventAvailable from "@mui/icons-material/EventAvailable";
import { Box, Fab, Typography, Zoom } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import TurnsManagement from "./TurnsManagement";
import AppointmentsManagement from "./AppointmentsManagement";
import ReportsManagement from "./ReportsManagement";
import { setIndex } from "@redux/reducers/admin";
import { setFullScreenDialogOpen } from "@redux/reducers/admin";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`action-tabpanel-${index}`}
      aria-labelledby={`action-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </Typography>
  );
}

const Admin = () => {
  const dispatch = useDispatch();

  const theme = useTheme();

  const { currentIndex } = useSelector((state) => state.admin);

  const handleChangeIndex = (index) => {
    dispatch(setIndex({ index }));
  };

  const handleOpenFullScreenDialogQueue = () => dispatch(setFullScreenDialogOpen({ open: true, location: "queue" }));
  const hanleOpenFullScreenDialogAppointments = () =>
    dispatch(setFullScreenDialogOpen({ open: true, location: "appointments" }));

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const fabStyle = {
    position: "absolute",
    bottom: 16,
    right: 16,
  };

  const fabs = [
    {
      color: "primary",
      sx: fabStyle,
      icon: <AddToQueue />,
      label: "Add",
      onClick: handleOpenFullScreenDialogQueue,
    },
    {
      color: "secondary",
      sx: fabStyle,
      icon: <EventAvailable />,
      label: "Edit",
      onClick: hanleOpenFullScreenDialogAppointments,
    },
  ];

  return (
    <>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={currentIndex}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={currentIndex} index={0} dir={theme.direction}>
          <TurnsManagement />
        </TabPanel>
        <TabPanel value={currentIndex} index={1} dir={theme.direction}>
          <AppointmentsManagement />
        </TabPanel>
        <TabPanel value={currentIndex} index={2} dir={theme.direction}>
          <ReportsManagement />
        </TabPanel>
      </SwipeableViews>
      {fabs.map((fab, index) => (
        <Zoom
          key={fab.color}
          in={currentIndex === index}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${
              currentIndex === index ? transitionDuration.exit : 0
            }ms`,
          }}
          unmountOnExit
        >
          <Fab
            sx={fab.sx}
            aria-label={fab.label}
            color={fab.color}
            onClick={fab.onClick}
          >
            {fab.icon}
          </Fab>
        </Zoom>
      ))}
    </>
  );
};

export default Admin;
