import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

const serverURL: string = import.meta.env.VITE_SERVER_URL;
axios.defaults.baseURL = serverURL;

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [authUser, setAuthUser] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const authUserRef = useRef(authUser);

  useEffect(() => {
    authUserRef.current = authUser;
  }, [authUser]);

  const connectSocket = (userData: any) => {
    if (!userData) return;

    setSocket((prevSocket) => {
      if (prevSocket?.connected) return prevSocket;

      const newSocket = io(serverURL, {
        query: { userId: userData?._id },
      });

      newSocket.on("get-online-users", (users) => {
        setOnlineUsers(users || []);
      });

      newSocket.onAny((event, ...args) => {
        console.log(event, args);
      });

      return newSocket;
    });
  };

  const checkAuth = async () => {
    try {
      if (!token) return;
      const { data: res } = await axios.get("/api/user/check-auth");

      if (res?.status) {
        setAuthUser(res?.data?.user);
        setToken(res?.data?.token);
        localStorage.setItem("authUser", JSON.stringify(res?.data?.user));
        localStorage.setItem("token", res?.data?.token);
        axios.defaults.headers.common["token"] = res?.data?.token;
        connectSocket(res?.data?.user);
      } else {
        setAuthUser(null);
      }
    } catch (error: any) {
      setAuthUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("authUser");
      delete axios.defaults.headers.common["token"];
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (state, credentials) => {
    try {
      const { data: res } = await axios.post(`/api/user/${state}`, credentials);

      if (res?.status) {
        setAuthUser(res?.data?.user);
        setToken(res?.data?.token);
        axios.defaults.headers.common["token"] = res?.data?.token;
        localStorage.setItem("token", res?.data?.token);
        localStorage.setItem("authUser", JSON.stringify(res?.data?.user));
        connectSocket(res?.data?.user);
        toast.success(res?.message || "Login successful");
      } else {
        toast.error(res?.message);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authUser");
    setToken(null);
    setAuthUser(null);
    delete axios.defaults.headers.common["token"];
    toast.success("Logout successful");

    if (socket) socket.disconnect();
    setSocket(null);
  };

  const updateProfile = async (body) => {
    try {
      const { data: res } = await axios.put("/api/user/update-profile", body);

      if (res?.status) {
        setAuthUser(res?.data?.user);
        localStorage.setItem("authUser", JSON.stringify(res?.data?.user));
        toast.success(res?.data?.message);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (![null, "null", undefined, "undefined"].includes(token) || !token)
      setToken(token);
    if (token) {
      axios.defaults.headers.common["token"] = token;
    }

    checkAuth();
  }, []);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    token,
    authLoading,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
