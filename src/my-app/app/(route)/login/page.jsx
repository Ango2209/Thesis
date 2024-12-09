"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3002/auth/signIn",
        // "http://34.121.32.167:3002/auth/signIn",
        {
          username: email,
          password,
          role,
        }
      );
      console.log("Patient data", response.data);

      const { user, tokens } = response.data;
      localStorage.setItem("PatientRole", user.role);
      localStorage.setItem("patientAccessToken", tokens.accessToken);
      localStorage.setItem("patientRefreshToken", tokens.refreshToken);
      localStorage.setItem("Patient", JSON.stringify(user));
      router.push("/");
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('/image.jpg')`, // Update with your image path
      }}
    >
      <div className="w-full max-w-md p-8 space-y-6 bg-white/90 rounded-lg shadow-lg backdrop-blur-md">
        <h1 className="text-3xl font-bold text-center text-indigo-600">
          Welcome Back
        </h1>
        <p className="text-sm text-center text-gray-500">Sign in to continue</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              User Name
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Sign In
          </button>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <a href="/register" className="text-indigo-500 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
