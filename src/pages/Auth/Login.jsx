import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("Error logging in:", error.message);
        alert(error.message);
      } else {
        alert("Login successful!");
        console.log("User logged in:", data.user);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Unexpected error logging in:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-indigo-600">
            TechRave
          </a>
          <div className="hidden md:flex space-x-4">
            <a href="/login" className="text-gray-600 hover:text-indigo-600">
              Login
            </a>
            <a
              href="/register"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Register
            </a>
          </div>
          <button
            className="md:hidden text-gray-600 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <a
              href="/login"
              className="block px-4 py-2 text-gray-600 hover:text-indigo-600"
            >
              Login
            </a>
            <a
              href="/register"
              className="block px-4 py-2 text-gray-600 hover:text-indigo-600"
            >
              Register
            </a>
          </div>
        )}
      </nav>

      {/* Login Form */}
      <div className="flex items-center justify-center py-10">
        <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Welcome Back
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Login
            </button>
          </form>
          <div className="mt-4 text-sm text-center text-gray-600">
            <a
              href="/forgot-password"
              className="text-indigo-500 hover:underline"
            >
              Forgot Password?
            </a>
          </div>
          <div className="mt-2 text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <a href="/register" className="text-indigo-500 hover:underline">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
