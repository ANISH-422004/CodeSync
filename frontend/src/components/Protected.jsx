import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios";
import { useUser } from "../context/User.context";

const Protected = ({ children }) => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axiosInstance.get("/users/profile", {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });
        // console.log(res);
        setUser(res.data)
      } catch (err) {
        console.log(err);
        localStorage.removeItem("token"); // Remove invalid token
        navigate("/login"); // Redirect if token is invalid
      }
    };

    checkAuth();
  }, [navigate]);

  return children;
};

export default Protected;
