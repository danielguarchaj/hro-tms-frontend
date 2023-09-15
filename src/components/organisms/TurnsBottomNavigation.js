import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import {
  People,
  HowToReg,
  CallMissedOutgoing,
  PersonOff,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setFilterParameter } from "@redux/reducers/admin";
import { TURN_LABEL_MAP } from "../../utils/constants";

export default function TurnsBottomNavigation({
  onQueueCount,
  attendedCount,
  absentCount,
  cancelledCount,
}) {
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(0);

  return (
    <Box sx={{ width: "100%", marginTop: "-1.5rem" }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_event, newValue) => {
          setValue(newValue);
          dispatch(setFilterParameter(TURN_LABEL_MAP[newValue]));
        }}
      >
        <BottomNavigationAction
          label={`En Cola: ${onQueueCount}`}
          icon={<People />}
        />
        <BottomNavigationAction
          label={`Atendidos: ${attendedCount}`}
          icon={<HowToReg />}
        />
        <BottomNavigationAction
          label={`Ausentes: ${absentCount}`}
          icon={<CallMissedOutgoing />}
        />
        <BottomNavigationAction
          label={`Anulados: ${cancelledCount}`}
          icon={<PersonOff />}
        />
      </BottomNavigation>
    </Box>
  );
}
