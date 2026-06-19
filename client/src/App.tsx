import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import { Toaster } from "react-hot-toast";
import { AuthContext } from "./contaxt/AuthContext";
import background from "./assets/background.png";
const App = () => {
  const { authUser }: any = useContext(AuthContext);
  return (
    <div
      className={`bg-cover`}
      style={{ backgroundImage: `url(${background})` }}
    >
      <Toaster />

      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to={"/"} /> : <Login />}
        />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to={"/login"} />}
        />
      </Routes>
    </div>
  );
};

export default App;
