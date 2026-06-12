import { useContext } from "react";
import assets, { imagesDummyData } from "../assets/assets";
import { ChatContext } from "../contaxt/ChatContext";
import { AuthContext } from "../contaxt/AuthContext";

const RightSidebar = () => {
  const { selectedUser }: any = useContext(ChatContext);
  const { onlineUsers }: any = useContext(AuthContext);
  return (
    selectedUser && (
      <div
        className={`bg-[#818582]/10 text-white w-full relative overflow-scroll ${selectedUser ? "max-md:hidden" : ""}`}
      >
        <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt=""
            className="w-20 aspect-ratio-[1/1] rounded-full"
          />
          <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
            {onlineUsers.includes(selectedUser?._id) ? (
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-slate-700"></span>
            )}
            {selectedUser?.fullName}
          </h1>
          <p className="px-10 mx-auto">{selectedUser?.bio}</p>
        </div>
        <hr className="border-[#ffffff50] my-4" />
        {/* <div className="px-5 text-xs">
          <p>media</p>
          <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
            {imagesDummyData.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url)}
                className="cursor-pointer rounded"
              >
                <img src={url} alt="" className="h-full rounded-md" />
              </div>
            ))}
          </div>
        </div> */}
        {/* <button className="w=[60%] absolute bottom-5  md:left-1/12   trasform-translate-x-1/2 bg-violet-800/80 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer">
          Logout
        </button> */}
      </div>
    )
  );
};

export default RightSidebar;
