import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext({});

export const ChatProvider = ({ children }: any) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [unseenMessages, setUnseenMessages] = useState<Record<string, number>>(
    {},
  );

  const selectedUserRef = useRef(selectedUser);

  const { socket, axios }: any = useContext(AuthContext);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  const getUsers = async () => {
    try {
      const { data: res } = await axios.get("/api/message/get-users");
      if (res.status) {
        setUsers(res?.data?.users || []);
        setUnseenMessages(res?.data?.unseenMessages || {});
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  };

  const getMessages = async () => {
    try {
      if (!selectedUser?._id) return;
      const { data: res } = await axios.get(`/api/message/${selectedUser._id}`);
      if (res.status) {
        setMessages(res?.data?.messages || []);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  };

  const sendMessage = async (messageData: any) => {
    try {
      if (!selectedUser?._id) return;
      const { data: res } = await axios.post(
        `/api/message/send-message/${selectedUser._id}`,
        messageData,
      );

      if (res.status) {
        setMessages((prev) => [...prev, res.data]);
      } else {
        toast.error(res?.message);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = async (newMessage: any) => {
      const currentSelectedUser = selectedUserRef.current;

      if (
        currentSelectedUser &&
        (newMessage?.senderId === currentSelectedUser._id ||
          newMessage?.receiverId === currentSelectedUser._id)
      ) {
        const updatedMessage = { ...newMessage, seen: true };

        setMessages((prev) => [...prev, updatedMessage]);

        try {
          await axios.put(`/api/message/mark-seen/${newMessage?._id}`);
        } catch (error) {
          console.error("mark seen failed", error);
        }
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        }));
      }
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [socket, axios]);

  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    getMessages,
    setMessages,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
