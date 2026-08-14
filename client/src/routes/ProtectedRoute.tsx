import React, { useEffect, useState } from "react";
import { useAuth } from "../context/Auth/useAuth";
import { replace, useNavigate, Navigate } from "react-router";
import toast from "react-hot-toast";
import AuthLoading from "../components/AuthLoading";

type Role = "ADMIN" | "STUDENT" | "FACULTY";

interface AllowedRoles {
  allowedRoles?: Role[];
  children: React.ReactNode;
}

function ProtectedRoute({ allowedRoles, children }: AllowedRoles): React.JSX.Element {
  const { user, isVerifying } = useAuth();
  if(isVerifying){
    return <AuthLoading/>
  }
  if(!user){
    return <Navigate to={"/login"} replace/>
  }
  if(!allowedRoles){
    return <>{children}</>;
  }
  if(allowedRoles.includes(user.role as Role)){
    return <>{children}</>;
  }
  return <Navigate to={"/403"} replace/>
}

export default ProtectedRoute;
