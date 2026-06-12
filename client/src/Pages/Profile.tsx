import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../contaxt/AuthContext";
import BackButton from "../components/BackButton";

const Profile = () => {
  const navigate = useNavigate();
  const { authUser, updateProfile }: any = useContext(AuthContext);

  const [data, setData] = useState<Record<string, any>>({
    profilePic: null,
    fullName: "",
    bio: "",
  });

  useEffect(() => {
    if (authUser) {
      setData({
        profilePic: authUser?.profilePic,
        fullName: authUser?.fullName,
        bio: authUser?.bio,
      });
    }
  }, [authUser]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!data.profilePic) {
      await updateProfile(data);
      navigate("/");
      return;
    }
    // convert image into base64
    const reader = new FileReader();
    reader.readAsDataURL(data.profilePic);

    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({
        ...data,
        profilePic: base64Image,
      });

      navigate("/");
    };
  };
  return (
    <div className="min-h-screen bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        <form
          onSubmit={submitHandler}
          className="flex flex-col gap-5 p-10 flex-1"
        >
          <h3 className="text-lg text-white">Profile Details</h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              onChange={(e) => {
                const file: File | undefined = e.target?.files?.[0];
                setData((data) => {
                  return { ...data, profilePic: file };
                });
              }}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={
                data?.profilePic
                  ? data?.profilePic instanceof Blob ||
                    data?.profilePic instanceof File
                    ? URL.createObjectURL(data?.profilePic)
                    : String(data?.profilePic) // ensure it's treated as a string URL
                  : assets.avatar_icon
              }
              className={`w-12 h-12 ${data?.profilePic ? "rounded-full" : ""}`}
              alt={data?.fullName || "User avatar"}
            />
            Upload Profile Picture
          </label>
          <input
            onChange={(e) =>
              setData((prev) => {
                return { ...prev, fullName: e.target.value };
              })
            }
            value={data?.fullName}
            type="text"
            required
            placeholder="Your name "
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <textarea
            onChange={(e) =>
              setData((prev) => {
                return { ...prev, bio: e.target.value };
              })
            }
            value={data?.bio}
            placeholder="Write Profile  bio"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            rows={4}
          />
          <button
            type="submit"
            className="w-full h-10 border bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-lg text-lg cursor-pointer"
          >
            Save
          </button>
        </form>
        <img
          src={authUser?.profilePic || assets.logo_icon}
          alt=""
          className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10"
        />
        <BackButton
          position={"absolute top-2 left-2"}
          onClick={() => navigate("/")}
        ></BackButton>
      </div>
    </div>
  );
};

export default Profile;
