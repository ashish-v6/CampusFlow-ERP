import React, { useEffect, useState } from "react";
import { useAuth } from "../context/Auth/useAuth";
import { replace, useNavigate, Navigate, Outlet } from "react-router";
import toast from "react-hot-toast";
import AuthLoading from "../components/AuthLoading";

type Role = "ADMIN" | "STUDENT" | "FACULTY";

interface AllowedRoles {
  allowedRoles?: Role[];
}

function ProtectedRoute({ allowedRoles }: AllowedRoles): React.JSX.Element {
  const { user, isVerifying } = useAuth();
  console.log("ProtectedRoute:", {
  user,
  isVerifying,
  });
  if(isVerifying){
    return <AuthLoading/>
  }
  if(!user){
    return <Navigate to={"/login"} replace/>
  }
  if(!allowedRoles){
    return <Outlet/>
  }
  if(allowedRoles.includes(user.role as Role)){
    return <Outlet/>;
  }
  return <Navigate to={"/403"} replace/>
}

export default ProtectedRoute;
