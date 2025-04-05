//mechanism to protect pages or routes
//protected container

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader } from "./index";

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    // Immediate check and navigation
    if (authentication && !authStatus) {
      navigate("/login", { replace: true });
    } else if (!authentication && authStatus) {
      navigate("/", { replace: true });
    }
    setLoader(false);
  }, [authStatus, navigate, authentication, location]);

  if (loader) {
    return <div className="w-full min-h-screen flex justify-center items-center">
      <Loader className1="h-20 w-20 bg-zinc-800" className2="bg-zinc-800" />
    </div>;
  }

  return <>{children}</>;
}
