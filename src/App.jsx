import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useSelector } from "react-redux";
import { useEffect } from "react";


function App() {
  const isloggedIn = useSelector(state => state.user.isLoggedIn)
  const navigate = useNavigate();
  console.log(isloggedIn)



  useEffect(() => {
    if (!isloggedIn) {
      navigate("/login");
    }
  }, [isloggedIn, navigate]);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default App
