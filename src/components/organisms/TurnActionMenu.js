import * as React from "react";
import { Divider, Tooltip, Menu, MenuItem, ListItemIcon } from "@mui/material";
import {
  People,
  HowToReg,
  CallMissedOutgoing,
  PersonOff,
} from "@mui/icons-material";
import { updateTurnStatus } from "@redux/reducers/turns";
import { useDispatch, useSelector } from "react-redux";
import Speech from "@molecules/Speech";
import { StyledTableCell, StyledTableRow } from "@utils/styles";
import { TURN_STATUS } from "@utils/constants";

export default function TurnActionMenu({ turn, index }) {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (_e, newStatus) => {
    setAnchorEl(null);
    if (
      [
        TURN_STATUS.onQueue,
        TURN_STATUS.attended,
        TURN_STATUS.absent,
        TURN_STATUS.cancelled,
      ].includes(newStatus)
    ) {
      dispatch(
        updateTurnStatus({ payload: { id: turn._id, newStatus }, token })
      );
    }
  };
  return (
    <React.Fragment>
      <Tooltip title="Acciones sobre el turno">
        <StyledTableRow
          key={`${turn.codigo}-StyledTableRow-Key-${index}`}
          sx={{
            "&:hover": {
              backgroundColor: "lightblue",
              cursor: "pointer",
            },
          }}
        >
          <StyledTableCell
            onClick={handleClick}
            component="th"
            scope="row"
            sx={{ fontSize: "1.5rem !important" }}
          >
            {turn.numero}
          </StyledTableCell>
          <StyledTableCell onClick={handleClick} component="th" scope="row">
            {turn.noHistoriaClinica}
          </StyledTableCell>
          <StyledTableCell onClick={handleClick} component="th" scope="row">
            {`${turn.nombres} ${turn.apellidos}`}
          </StyledTableCell>
          <StyledTableCell onClick={handleClick} align="left">
            {turn.sexo}
          </StyledTableCell>
          <StyledTableCell onClick={handleClick} align="left">
            {turn.nombrePadre}
          </StyledTableCell>
          <StyledTableCell onClick={handleClick} align="left">
            {turn.nombreMadre}
          </StyledTableCell>
          <StyledTableCell onClick={handleClick} align="left">
            {turn.nombre_Resposable}
          </StyledTableCell>
        </StyledTableRow>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "center", vertical: "center" }}
      >
        <Speech
          text={`Turno ${turn.numero}, ${turn.nombres} ${turn.apellidos}`}
        />
        <Divider />
        {turn.status !== TURN_STATUS.onQueue && (
          <MenuItem onClick={(e) => handleClose(e, TURN_STATUS.onQueue)}>
            <ListItemIcon>
              <People />
            </ListItemIcon>
            En Cola
          </MenuItem>
        )}
        {turn.status !== TURN_STATUS.attended && (
          <MenuItem onClick={(e) => handleClose(e, TURN_STATUS.attended)}>
            <ListItemIcon>
              <HowToReg />
            </ListItemIcon>
            Atendido
          </MenuItem>
        )}
        {turn.status !== TURN_STATUS.absent && (
          <MenuItem onClick={(e) => handleClose(e, TURN_STATUS.absent)}>
            <ListItemIcon>
              <CallMissedOutgoing />
            </ListItemIcon>
            Ausente
          </MenuItem>
        )}
        {turn.status !== TURN_STATUS.cancelled && (
          <MenuItem onClick={(e) => handleClose(e, TURN_STATUS.cancelled)}>
            <ListItemIcon>
              <PersonOff />
            </ListItemIcon>
            Anular
          </MenuItem>
        )}
      </Menu>
    </React.Fragment>
  );
}
