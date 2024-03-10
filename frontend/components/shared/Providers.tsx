// Providers.tsx
import React from "react";
import { AuthProvider } from "./authContext"; // Sesuaikan path sesuai struktur proyek Anda

interface Props {
  children: React.ReactNode;
}

const Providers = ({ children }: Props) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default Providers;
