"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import RoleSelector from "../(components)/RoleSelector/RoleSelector";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("doctor");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send a request to your backend
    alert(`Registered as ${role}`);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('/annual-checkup.jpg')`, // Path to your image in the public folder
      }}
    >
      <div className="w-full max-w-md p-8 space-y-6 bg-white/90 rounded-lg shadow-lg backdrop-blur-md">
        <h1 className="text-3xl font-bold text-center text-indigo-600">
          Create an Account
        </h1>
        <p className="text-sm text-center text-gray-500">
          Fill in the details to register
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              User Name
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              placeholder="name@example.com"
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
            className="w-full py-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Register
          </button>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-indigo-500 hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
