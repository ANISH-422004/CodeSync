import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { useUser } from "../context/User.context";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const HandelLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const loginFormData = new FormData();
      loginFormData.append("email", email);
      loginFormData.append("password", password);

      const response = await axios.post("/users/login", loginFormData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // To include cookies (if needed for authentication)
      });

      console.log("Login successful:", response.data);
      setUser(response.data.user)
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      setErrors(error.response?.data.errors || error.response?.data?.message);
      console.error(
        error.response?.data.errors || error.response?.data?.message
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form
          onSubmit={(e) => {
            HandelLogin(e);
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {Array.isArray(errors) && errors.length > 0 ? (
            errors.map((e, index) => (
              <div
                key={index}
                className="text-red-500 text-sm mb-2 text-center"
              >
                {e.msg}
              </div>
            ))
          ) : (
            <div className="text-red-500 text-sm mb-2 text-center">
              {errors}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/register" className="text-blue-500 hover:underline">
            Don't have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
