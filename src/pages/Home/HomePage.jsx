
const courses = [
  {
    id: 1,
    name: "Web Development",
    description: "Master HTML, CSS, and JavaScript to build responsive websites.",
    level: "Beginner",
  },
  {
    id: 2,
    name: "Data Science",
    description: "Analyze and visualize data using Python and machine learning.",
    level: "Intermediate",
  },
  {
    id: 3,
    name: "Digital Marketing",
    description: "Learn SEO, social media marketing, and analytics tools.",
    level: "Beginner",
  },
];

const testimonials = [
  {
    id: 1,
    quote:
      "Techrave transformed my career. The courses are well-structured, and the instructors are amazing!",
    name: "Jane Doe",
  },
  {
    id: 2,
    quote:
      "The interactive quizzes and expert guidance were game-changers for me. Highly recommend Techrave!",
    name: "John Smith",
  },
  {
    id: 3,
    quote: "I love the flexibility Techrave offers. Learning has never been this easy!",
    name: "Emily Johnson",
  },
];

export default function HomePage() {
  return (
    <div className="font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
            Techrave
          </h1>
          <div>
            <a href="/login" className="text-blue-600 px-4 py-2 hover:underline">
              Login
            </a>
            <a
              href="/register"
              className="text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Register
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white p-12">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold">Level Up Your Skills with Techrave</h1>
          <p className="text-lg md:text-xl">
            Join thousands of learners and dive into tech courses curated for all levels.
          </p>
          <a href="/register">
          <button className="px-6 py-3 bg-yellow-400 text-black rounded-lg shadow-lg hover:bg-yellow-500">
            Get Started
          </button>
          </a>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Explore Our Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transform hover:scale-105 transition"
              >
                <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
                <p className="text-gray-700 mb-4">{course.description}</p>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mb-4">
                  {course.level}
                </span>
                <button className="text-blue-500 hover:underline">Learn More</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">What Our Students Say</h2>
          <div className="space-y-6 sm:space-y-0 sm:flex sm:justify-center sm:gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-gray-100 shadow-md rounded-lg p-6 w-full sm:w-1/3 hover:shadow-lg"
              >
                <p className="text-gray-700 mb-4">&quot;{testimonial.quote}&quot;</p>
                <h4 className="text-lg font-semibold">{testimonial.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
          <p className="text-gray-700">
            Have questions? Send us an email at{" "}
            <a href="mailto:info@techrave.com" className="text-blue-600 hover:underline">
              info@techrave.com
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Techrave. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
