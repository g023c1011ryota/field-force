"use client";

import { useContext } from "react";

import { AuthContext } from "@/features/auth/components/AuthProvider";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthProvider is missing");
  }
  return context;
};
