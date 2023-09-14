import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { APP_URLS } from "@routes";

import ResponsiveAppBar from "@organisms/ResponsiveAppBar";

const PrivateLayout = () => {
  const { token, sessionExpired } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(verifyToken({ token, refreshToken }));
    if (!token) {
      return navigate(APP_URLS.login);
    }
  }, [navigate, dispatch, token]);

  return (
    <div>
      <ResponsiveAppBar />
      <Outlet />
    </div>
  );
};

export default PrivateLayout;
