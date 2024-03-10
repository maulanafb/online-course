"use client";
import React, { createContext, useContext, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";

interface UserData {
  id: number;
  name: string;
  // Tambahkan properti lain sesuai kebutuhan
}

interface AuthContextProps {
  userData?: UserData;
  setUserData: (data: UserData) => void;
  fetchUserData: () => void; // add fetchUserData function
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userData, setUserData] = React.useState<UserData | undefined>(
    undefined
  );

  const fetchUserData = async () => {
    const authToken = Cookies.get("CC_COOKIES");

    if (authToken) {
      try {
        const res = await fetch(
          "http://192.168.18.33:8088/api/v1/users/fetch",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (res.ok) {
          const userDataResponse = await res.json();

          // Jika struktur data adalah userData.data
          const fetchedUserData = userDataResponse.data;

          setUserData(fetchedUserData);
        } else {
          console.error("Failed to fetch user data:", res.status);
        }
      } catch (error) {
        console.error("An error occurred during fetch user data:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []); // Sesuaikan dependencies sesuai kebutuhan

  return (
    <AuthContext.Provider value={{ userData, setUserData, fetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Export fetchUserData
export const fetchUserData = async () => {
  console.log("data fetched");
};
