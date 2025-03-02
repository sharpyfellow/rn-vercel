import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user");
      if (storedToken && storedUser) {
        setToken(JSON.parse(storedToken));
        setUser(JSON.parse(storedUser));
      }
    };
    loadToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post("https://rn-atlas-image-picker-1.onrender.com/login", {
        email,
        password,
      });
      const { token, user } = response.data;
      if (!token || !user) {
        throw new Error("Invalid login response");
      }
      setToken(token);
      setUser(user);
      await AsyncStorage.setItem("token", JSON.stringify(token));
      await AsyncStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.log("Error logging in:", error);
      throw error;
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
