import { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../contaxt/AuthContext";
import BackButton from "../components/BackButton";

const Login = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [data, setData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (currState === "Sign up" && !isSubmitted) {
      setIsSubmitted(true);
      return;
    }
    login(currState === "Sign up" ? "signup" : "login", data);
  };

  const { login }: any = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* left */}
      <img src={assets.logo_big} alt="" className="w-[min(30vw,400px)]" />

      {/* right */}
      <form
        onSubmit={onSubmitHandler}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-5 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          {isSubmitted && (
            // <img
            //   onClick={() => {
            //     setIsSubmitted(false);
            //   }}
            //   src={assets.arrow_icon}
            //   alt=""
            //   className="w-5 cursor-pointer"
            // />
            <BackButton
              onClick={() => setIsSubmitted(false)}
              position="right"
            />
          )}
        </h2>

        {currState === "Sign up" && !isSubmitted && (
          <input
            onChange={(e) =>
              setData((prev) => {
                return { ...prev, fullName: e.target.value };
              })
            }
            type="text"
            placeholder="Full Name"
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        )}
        {!isSubmitted && (
          <>
            <input
              type="email"
              placeholder="Email Address"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
              onChange={(e) =>
                setData((prev) => {
                  return { ...prev, email: e.target.value };
                })
              }
            />
            <input
              type="Password"
              placeholder="Password"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
              onChange={(e) =>
                setData((prev) => {
                  return { ...prev, password: e.target.value };
                })
              }
            />
          </>
        )}
        {currState === "Sign up" && isSubmitted && (
          <textarea
            onChange={(e) =>
              setData((prev) => {
                return { ...prev, bio: e.target.value };
              })
            }
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
            placeholder="provide a short bio ..."
            required
          ></textarea>
        )}
        <button
          onClick={onSubmitHandler}
          type="submit"
          className="py-2 border border-violet-300 bg-violet-800/80 text-white-900 rounded-md cursor-pointer"
        >
          {currState === "Sign up" ? "Create Account" : "Login"}
        </button>
        <div className="flex items-center gap-2 text-sm text-white-900">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy</p>
        </div>
        <div className="flex flex-col gap-2">
          {currState === "Sign up" ? (
            <p className="text-sm text-white-900 text-center">
              Already have an account?{" "}
              <span
                className="font-medium text-purple-400 cursor-pointer"
                onClick={() => {
                  setCurrState("Login");
                  setIsSubmitted(false);
                }}
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Create an account
              <span
                className="font-medium text-violet-500 cursor-pointer"
                onClick={() => {
                  setCurrState("Sign up");
                  setIsSubmitted(false);
                }}
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
