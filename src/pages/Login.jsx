// src/pages/Login.jsx
import { useState } from "react";
import axios from "axios";

export default function Login({ setUser, setView }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token); // save token
      setUser(res.data); // store user in state
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl mb-4 font-bold">Login</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 mb-2 rounded bg-gray-700"
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 mb-4 rounded bg-gray-700"
        />
        <button type="submit" className="w-full bg-blue-600 p-2 rounded hover:bg-blue-700 mb-2">
          Login
        </button>
        <p className="text-sm text-gray-400 mt-2">
          Don't have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => setView("signup")}
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}
