import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [course, setCourse] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for the menu toggle

  // Fetch courses from the database
  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase.from("courses").select("*");
      if (error) {
        console.error("Error fetching courses:", error.message);
      } else {
        setCourses(data);
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!course) {
      alert("Please select a course.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Error registering:", error.message);
      alert("Error registering. Please try again.");
      return;
    }

    const user = data?.user;

    if (!user) {
      console.error("User object is undefined:", data);
      alert("Unexpected error during registration.");
      return;
    }

    try {
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: user.id,
          email: user.email,
          course_selected: course,
          role: "student", // Default role
        },
      ]);

      if (insertError) {
        console.error("Error inserting user into users table:", insertError.message);
        alert(
          "User registration in the custom users table failed. Please contact support."
        );
        return;
      }

      alert("Registration successful! Please verify your email.");
    } catch (err) {
      console.error("Unexpected error:", err.message);
      alert("An unexpected error occurred. Please try again.");
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

      {/* Registration Form */}
      <div className="flex items-center justify-center py-10">
        <form
          onSubmit={handleRegister}
          className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Create Account
          </h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select a Course
          </label>
          {loading ? (
            <p className="text-sm text-gray-500">Loading courses...</p>
          ) : (
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full px-4 py-2 mb-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            >
              <option value="" disabled>
                -- Choose a Course --
              </option>
              {courses.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Register
          </button>
          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-500 hover:underline">
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
