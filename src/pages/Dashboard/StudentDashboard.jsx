import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useNavigate } from "react-router-dom";


export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: sessionData, error } = await supabase.auth.getSession();
        if (error) throw error;
        const user = sessionData?.session?.user;

        if (user) {
          setUser(user);
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("course_selected")
            .eq("id", user.id)
            .single();

          if (userError) throw userError;

          if (userData?.course_selected) setCourse(userData.course_selected);
        }
      } catch (err) {
        console.error("Error fetching user data:", err.message);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchLessonsAndProgress = async () => {
      try {
        const { data: courseData, error: courseError } = await supabase
          .from("courses")
          .select("id")
          .eq("name", course)
          .single();
        if (courseError) throw courseError;

        const courseId = courseData?.id;
        if (!courseId) throw new Error("Course ID not found.");

        const { data: lessonsData, error: lessonsError } = await supabase
          .from("lessons")
          .select("*")
          .eq("course_id", courseId)
          .order("order_index", { ascending: true });
        if (lessonsError) throw lessonsError;

        setLessons(lessonsData || []);

        const { data: progressData, error: progressError } = await supabase
          .from("progress")
          .select("*")
          .eq("user_id", user?.id);
        if (progressError) throw progressError;

        setProgress(progressData || []);

        const lastLesson = progressData.find((p) => !p.completed);
        if (lastLesson) {
          const index = lessonsData.findIndex((lesson) => lesson.id === lastLesson.lesson_id);
          if (index !== -1) setCurrentLessonIndex(index);
        }
      } catch (err) {
        console.error("Error fetching lessons and progress:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (course && user) fetchLessonsAndProgress();
  }, [course, user]);

  const calculateProgress = () => {
    if (lessons.length === 0) return 0;
    const completedLessons = progress.filter((p) => p.completed).length;
    return Math.round((completedLessons / lessons.length) * 100);
  };

  const markLessonAsCompleted = async () => {
    const currentLesson = lessons[currentLessonIndex];
    const isCompleted = progress.some(
      (p) => p.lesson_id === currentLesson.id && p.completed
    );

    if (!isCompleted) {
      await supabase.from("progress").upsert({
        user_id: user.id,
        lesson_id: currentLesson.id,
        completed: true,
      });
      setProgress((prev) => [
        ...prev,
        { user_id: user.id, lesson_id: currentLesson.id, completed: true },
      ]);
    }
  };

  const handleNextLesson = async () => {
    if (currentLessonIndex < lessons.length - 1) {
      await markLessonAsCompleted();
      setCurrentLessonIndex((prev) => prev + 1);
    } else if (currentLessonIndex === lessons.length - 1) {
      await markLessonAsCompleted();
      setShowCompletionScreen(true);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) setCurrentLessonIndex((prev) => prev - 1);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCourse(null);
    setLessons([]);
    setProgress([]);
    setCurrentLessonIndex(0);
    setShowCompletionScreen(false);
  
    // Redirect to homepage or login page
    navigate("/login"); // Replace "/login" with your desired route
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen p-4 bg-gray-50">
      <header className="sticky top-0 z-10 flex justify-between items-center p-4 bg-white shadow-md">
        <h1 className="text-xl font-bold text-gray-700">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-white bg-red-500 px-3 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      <main className="flex-grow">
        {course ? (
          <>
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Course: {course}
            </h2>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className="bg-green-500 h-4 rounded-full transition-all"
                style={{ width: `${showCompletionScreen ? 100 : calculateProgress()}%` }}
              ></div>
            </div>

            {showCompletionScreen ? (
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-xl font-bold text-green-600">Congratulations!</h3>
                <p className="text-gray-700">You’ve completed the course!</p>
              </div>
            ) : lessons.length > 0 ? (
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-2">
                  {lessons[currentLessonIndex]?.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {lessons[currentLessonIndex]?.content}
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={handlePrevLesson}
                    disabled={currentLessonIndex === 0}
                    className={`px-4 py-2 rounded ${
                      currentLessonIndex === 0
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    Prev
                  </button>
                  <button
                    onClick={handleNextLesson}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    {currentLessonIndex < lessons.length - 1
                      ? "Next"
                      : "Complete"}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No lessons found.</p>
            )}
          </>
        ) : (
          <p className="text-gray-600">No course selected.</p>
        )}
      </main>
    </div>
  );
}
