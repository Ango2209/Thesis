"use client";
import { useState } from "react";
import RoleSelector from "../(components)/RoleSelector/RoleSelector";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("doctor");
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with your authentication logic
      // const response = await axios.post("http://localhost:3002/auth/signIn", {
      //   username: email,
      //   password,
      //   role,
      // });
      const response = await axios.post(
        "http://34.121.32.167:3002/auth/signIn",
        {
          username: email,
          password,
          role,
        }
      );
      // Extract user and tokens from the response
      const { user, tokens } = response.data;
      if (role === "admin") {
        localStorage.setItem("admin", JSON.stringify(user));
      } else {
        localStorage.setItem("doctor", JSON.stringify(user));
      }
      // Store the access token in local storage
      localStorage.setItem("accessToken", tokens.accessToken);

      // Optionally store the refresh token if needed
      localStorage.setItem("refreshToken", tokens.refreshToken);
      localStorage.setItem("userRole", user.role);

      // Redirect to a dashboard or home page
      router.push("/dashboard");
      // Handle successful login, e.g., redirect or store token
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('/annual-checkup.jpg')`, // Update with your image path
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
              placeholder="nguyenngo2208"
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
              placeholder="••••••••"
            />
          </div>
          <RoleSelector role={role} setRole={setRole} />
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
