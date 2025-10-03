// src/pages/Signup.jsx
import { useState } from "react";
import axios from "axios";

export default function Signup({ setUser, setView }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  try {
    // Only send the fields backend expects
    const { name, email, password } = form;

    const res = await axios.post(
      "http://localhost:5000/api/auth/register",
      { name, email, password }
    );

    localStorage.setItem("token", res.data.token);
    setUser(res.data);
  } catch (err) {
    console.error(err.response?.data || err); // log server error
    setError(err.response?.data?.message || "Signup failed");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl mb-4 font-bold">Sign Up</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 mb-2 rounded bg-gray-700"
        />
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
          className="w-full p-2 mb-2 rounded bg-gray-700"
        />
        <input
          name="confirmPassword"
          placeholder="Confirm Password"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full p-2 mb-4 rounded bg-gray-700"
        />
        <button type="submit" className="w-full bg-green-600 p-2 rounded hover:bg-green-700 mb-2">
          Sign Up
        </button>
        <p className="text-sm text-gray-400 mt-2">
          Already have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => setView("login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
