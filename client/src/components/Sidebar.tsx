import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../contaxt/AuthContext";
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../contaxt/ChatContext";
const Sidebar = () => {
  const navigate = useNavigate();
  const { logout, onlineUsers }: any = useContext(AuthContext);
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  }: any = useContext(ChatContext);

  const [input, setInput] = useState("");
  const filterUsers = input
    ? users.filter((user) =>
        user?.fullName?.toLowerCase().includes(input.toLowerCase()),
      )
    : users;
  useEffect(() => {
    getUsers();
  }, [onlineUsers]);
  return (
    <div
      className={`bg-[#8185B2]/10  h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ""}`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-10 max-md:w-20" />

          <div className="relative py-2 group">
            <input type="checkbox" id="menu-toggle" className="peer hidden" />
            <label htmlFor="menu-toggle" className="cursor-pointer">
              <img
                src={assets.menu_icon}
                alt="logo"
                className=" max-w-5 cursor-pointer"
              />
            </label>
            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] focus-within:bg-[#282142]  border border-gray-600 text-gray-100 hidden peer-checked:block ">
              <p
                onClick={() => {
                  navigate("/profile");
                }}
                className="cursor-pointer text-sm text-center"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p
                className="cursor-pointer text-sm text-center"
                onClick={() => {
                  logout();
                }}
              >
                Logout
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-800 rounded-full flex items-center px-3 py-2 mt-5">
          <img src={assets.search_icon} alt="search" className="w-3" />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search users. . ."
          />
        </div>
      </div>
      <div className="flex flex-col">
        {filterUsers.map((user, index: number) => (
          <div
            key={index}
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages((prev) => ({ ...prev, [user?._id]: 0 }));
            }}
            // bg-[#282142]
            className={`relative flex items-center gap-2 pl-4 p-2 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && "bg-purple-800/90"}`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              className="w-[35px] aspect-[1/1] rounded-full"
              key={index}
              alt=""
            />
            <div className="flex flex-col leading-5">
              <p>{user?.fullName}</p>
              {onlineUsers.includes(user?._id) ? (
                <span className="text-green-400 text-xs">Online</span>
              ) : (
                <span className="text-natural-400 text-xs">Offline</span>
              )}
            </div>
            {unseenMessages[user?._id] > 0 && (
              <p className="absolute top-4 right-4 text-xs w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
