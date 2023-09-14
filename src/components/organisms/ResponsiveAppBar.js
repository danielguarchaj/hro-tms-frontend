import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "@redux/reducers/auth";
import { setIndex } from "@redux/reducers/admin";
import { Tab, Tabs } from "@mui/material";

const pages = ["Turnos", "Citas", "Reportes"];

function a11yProps(index) {
  return {
    id: `action-tab-${index}`,
    "aria-controls": `action-tabpanel-${index}`,
  };
}

function ResponsiveAppBar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentIndex } = useSelector((state) => state.admin);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const username = user?.username;
  const area = user?.area?.name;

  const settings = [`${username} | Cerrar sesión`];

  const handleChange = (_event, newValue) => {
    dispatch(setIndex({ index: newValue }));
  };

  return (
    <AppBar position="static" color="transparent">
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Tabs
            value={currentIndex}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
          >
            {pages.map((page, index) => (
              <Tab
                key={`app-bar-tab-key-${index}`}
                label={page}
                {...a11yProps(index)}
              />
            ))}
          </Tabs>
          <Typography textAlign="center" variant="h5">
            Area: {area}
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Abrir">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={username} src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleLogout}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
