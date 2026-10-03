import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000";

function App() {
  /* =====================================================
     AUTH / SESSION
  ===================================================== */

  const [isLogin, setIsLogin] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("skillbridgeLoggedIn") === "true";
  });

  const [name, setName] = useState(() => {
    return localStorage.getItem("skillbridgeName") || "";
  });

  const [email, setEmail] = useState(() => {
    return localStorage.getItem("skillbridgeEmail") || "";
  });

  const [password, setPassword] = useState("");

  const [activePage, setActivePage] = useState("Dashboard");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  const [isApplying, setIsApplying] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  /* =====================================================
     MY APPLICATIONS
  ===================================================== */

  const [applications, setApplications] = useState([]);

  const [applicationData, setApplicationData] = useState({
    phone: "",
    resume: "",
    coverNote: "",
  });

  /* PROFILE EDIT */
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  /* COURSE FILTERS */
  const [courseSearch, setCourseSearch] = useState("");
  const [courseCategory, setCourseCategory] = useState("All");
  const [courseStatus, setCourseStatus] = useState("All");

  /* SKILL FILTERS */
  const [skillSearch, setSkillSearch] = useState("");
  const [skillCategory, setSkillCategory] = useState("All");

  /* RECENT ACTIVITY */
  const [activities, setActivities] = useState([
    {
      id: 1,
      icon: "📚",
      title: "Started Full Stack Web Development",
      description: "You continued your learning journey.",
      time: "2 hours ago",
    },
    {
      id: 2,
      icon: "🏆",
      title: "Completed React Development",
      description: "You completed all React modules.",
      time: "Yesterday",
    },
  ]);

  /* COURSE PROGRESS */
  const [courseProgress, setCourseProgress] = useState({
    1: { progress: 65, completedModules: 8 },
    2: { progress: 100, completedModules: 10 },
    3: { progress: 40, completedModules: 3 },
    4: { progress: 25, completedModules: 4 },
    5: { progress: 0, completedModules: 0 },
    6: { progress: 80, completedModules: 5 },
  });

  /* =====================================================
     COURSE DATA
  ===================================================== */

  const courses = [
    {
      id: 1,
      title: "Full Stack Web Development",
      category: "Web Development",
      progress: 65,
      modules: 12,
      completedModules: 8,
      status: "In Progress",
      icon: "💻",
      modulesList: [
        "Introduction to Web Development",
        "HTML & CSS Fundamentals",
        "JavaScript Basics",
        "Advanced JavaScript",
        "React Fundamentals",
        "React Components & Props",
        "State Management & Hooks",
        "Building React Interfaces",
        "Node.js Fundamentals",
        "Express.js & REST APIs",
        "MongoDB & Database Integration",
        "Full Stack Project",
      ],
    },
    {
      id: 2,
      title: "React Development",
      category: "Web Development",
      progress: 100,
      modules: 10,
      completedModules: 10,
      status: "Completed",
      icon: "⚛️",
      modulesList: [
        "Introduction to React",
        "JSX and Components",
        "Props and Component Communication",
        "State and Events",
        "React Hooks",
        "Conditional Rendering",
        "Lists and Forms",
        "React Router",
        "API Integration",
        "React Mini Project",
      ],
    },
    {
      id: 3,
      title: "UI/UX Design",
      category: "Design",
      progress: 40,
      modules: 8,
      completedModules: 3,
      status: "In Progress",
      icon: "🎨",
      modulesList: [
        "Introduction to UI/UX",
        "User Research",
        "Design Thinking",
        "Wireframing",
        "Visual Design",
        "Prototyping",
        "Usability Testing",
        "UI/UX Case Study",
      ],
    },
    {
      id: 4,
      title: "Python Programming",
      category: "Programming",
      progress: 25,
      modules: 14,
      completedModules: 4,
      status: "In Progress",
      icon: "🐍",
      modulesList: [
        "Introduction to Python",
        "Variables and Data Types",
        "Operators and Expressions",
        "Conditional Statements",
        "Loops in Python",
        "Functions",
        "Lists and Tuples",
        "Dictionaries and Sets",
        "File Handling",
        "Exception Handling",
        "Object Oriented Programming",
        "Modules and Packages",
        "Working with APIs",
        "Python Mini Project",
      ],
    },
    {
      id: 5,
      title: "Data Structures & Algorithms",
      category: "Programming",
      progress: 0,
      modules: 16,
      completedModules: 0,
      status: "Not Started",
      icon: "🧠",
      modulesList: [
        "Introduction to Data Structures",
        "Time and Space Complexity",
        "Arrays",
        "Strings",
        "Linked Lists",
        "Stacks",
        "Queues",
        "Hash Tables",
        "Trees",
        "Binary Search Trees",
        "Heaps",
        "Graphs",
        "Searching Algorithms",
        "Sorting Algorithms",
        "Dynamic Programming",
        "Algorithm Practice Project",
      ],
    },
    {
      id: 6,
      title: "Communication Skills",
      category: "Soft Skills",
      progress: 80,
      modules: 6,
      completedModules: 5,
      status: "In Progress",
      icon: "🗣️",
      modulesList: [
        "Communication Fundamentals",
        "Speaking with Confidence",
        "Professional English",
        "Presentation Skills",
        "Interview Communication",
        "Professional Communication Project",
      ],
    },
  ];

  /* =====================================================
     OPPORTUNITY DATA
  ===================================================== */

  const opportunities = [
    {
      id: 1,
      title: "Frontend Developer Intern",
      company: "Tech Startup",
      type: "Internship",
      icon: "💻",
      location: "Chennai, Tamil Nadu",
      mode: "Hybrid",
      stipend: "₹15,000 / month",
      deadline: "30 October 2026",
      eligibility:
        "B.Tech / B.E. students with basic web development knowledge.",
      skills: ["HTML", "CSS", "JavaScript", "React"],
      description:
        "Work with a frontend team to build responsive web interfaces and contribute to real-world product features.",
    },
    {
      id: 2,
      title: "React Developer",
      company: "Software Company",
      type: "Internship",
      icon: "⚛️",
      location: "Bengaluru, Karnataka",
      mode: "On-site",
      stipend: "₹20,000 / month",
      deadline: "5 November 2026",
      eligibility:
        "Students with React and JavaScript fundamentals.",
      skills: ["JavaScript", "React", "Git", "REST API"],
      description:
        "Build reusable React components, integrate APIs and work with developers on production-oriented applications.",
    },
    {
      id: 3,
      title: "UI/UX Design Intern",
      company: "Design Studio",
      type: "Internship",
      icon: "🎨",
      location: "Coimbatore, Tamil Nadu",
      mode: "Hybrid",
      stipend: "₹12,000 / month",
      deadline: "12 November 2026",
      eligibility:
        "Students interested in UI/UX with basic design knowledge.",
      skills: ["Figma", "Wireframing", "Prototyping", "User Research"],
      description:
        "Assist the design team in creating wireframes, prototypes and user-friendly interfaces for digital products.",
    },
    {
      id: 4,
      title: "Python Developer Intern",
      company: "Technology Company",
      type: "Internship",
      icon: "🐍",
      location: "Remote",
      mode: "Remote",
      stipend: "₹18,000 / month",
      deadline: "20 November 2026",
      eligibility:
        "Students with basic Python and programming knowledge.",
      skills: ["Python", "OOP", "APIs", "SQL"],
      description:
        "Work on Python-based applications, APIs and automation tasks while gaining practical software development experience.",
    },
  ];

  /* =====================================================
     SKILL DATA
  ===================================================== */

  const skills = [
    {
      name: "React.js",
      progress: 65,
      icon: "⚛️",
      category: "Technical",
    },
    {
      name: "Node.js",
      progress: 55,
      icon: "🟢",
      category: "Technical",
    },
    {
      name: "Python",
      progress: 45,
      icon: "🐍",
      category: "Technical",
    },
    {
      name: "UI/UX",
      progress: 35,
      icon: "🎨",
      category: "Design",
    },
    {
      name: "Communication",
      progress: 80,
      icon: "🗣️",
      category: "Soft Skills",
    },
    {
      name: "Data Structures",
      progress: 20,
      icon: "🧠",
      category: "Technical",
    },
  ];

  /* =====================================================
     LOAD APPLICATIONS
  ===================================================== */

  const loadApplications = async (userEmail) => {
    if (!userEmail) return;

    try {
      const response = await fetch(
        `${API_URL}/user/${encodeURIComponent(userEmail)}/applications`
      );

      if (!response.ok) {
        console.log("Unable to load applications.");
        return;
      }

      const data = await response.json();

      setApplications(data.applications || []);
    } catch (error) {
      console.log(
        "Unable to load applications:",
        error
      );
    }
  };

  /* =====================================================
     LOAD USER DATA FROM BACKEND
  ===================================================== */

  const loadUserData = async (userEmail) => {
    try {
      const response = await fetch(
        `${API_URL}/user/${encodeURIComponent(userEmail)}`
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      if (data.user) {
        setName(data.user.name || "");
        setEmail(data.user.email || "");

        localStorage.setItem(
          "skillbridgeName",
          data.user.name || ""
        );

        localStorage.setItem(
          "skillbridgeEmail",
          data.user.email || ""
        );
      }

      if (data.progress && data.progress.length > 0) {
        setCourseProgress((current) => {
          const updated = { ...current };

          data.progress.forEach((item) => {
            updated[item.courseId] = {
              progress: item.progress,
              completedModules: item.completedModules,
            };
          });

          return updated;
        });
      }

      if (data.activities && data.activities.length > 0) {
        setActivities(
          data.activities.map((activity) => ({
            id: activity._id || Date.now(),
            icon: activity.icon,
            title: activity.title,
            description: activity.description,
            time: activity.time,
          }))
        );
      }

      await loadApplications(userEmail);
    } catch (error) {
      console.log("Unable to load user data:", error);
    }
  };

  /* =====================================================
     RESTORE SESSION AFTER REFRESH
  ===================================================== */

  useEffect(() => {
    const savedLogin =
      localStorage.getItem("skillbridgeLoggedIn");

    const savedEmail =
      localStorage.getItem("skillbridgeEmail");

    if (savedLogin === "true" && savedEmail) {
      setIsLoggedIn(true);
      loadUserData(savedEmail);
    }
  }, []);

  /* =====================================================
     UPDATED COURSES
  ===================================================== */

  const updatedCourses = courses.map((course) => {
    const current = courseProgress[course.id];

    if (!current) return course;

    return {
      ...course,
      progress: current.progress,
      completedModules: current.completedModules,
      status:
        current.progress === 100
          ? "Completed"
          : current.progress === 0
          ? "Not Started"
          : "In Progress",
    };
  });

  /* =====================================================
     REGISTER
  ===================================================== */

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");

        setIsLogin(true);
        setPassword("");
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (error) {
      alert("Unable to connect to server.");
    }
  };

  /* =====================================================
     LOGIN
  ===================================================== */

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const loggedInName = data.user?.name || name;
        const loggedInEmail = data.user?.email || email;

        setIsLoggedIn(true);
        setActivePage("Dashboard");

        setName(loggedInName);
        setEmail(loggedInEmail);

        localStorage.setItem(
          "skillbridgeLoggedIn",
          "true"
        );

        localStorage.setItem(
          "skillbridgeName",
          loggedInName
        );

        localStorage.setItem(
          "skillbridgeEmail",
          loggedInEmail
        );

        setPassword("");

        await loadUserData(loggedInEmail);

        alert("Login successful!");
      } else {
        alert(data.message || "Login failed.");
      }
    } catch (error) {
      alert("Unable to connect to server.");
    }
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem("skillbridgeLoggedIn");
    localStorage.removeItem("skillbridgeName");
    localStorage.removeItem("skillbridgeEmail");

    setIsLoggedIn(false);

    setActivePage("Dashboard");
    setSelectedCourse(null);
    setSelectedOpportunity(null);
    setIsApplying(false);
    setApplicationSubmitted(false);
    setPassword("");
    setIsEditingProfile(false);
    setApplications([]);

    alert("Logged out successfully!");
  };

  /* =====================================================
     PAGE CHANGE
  ===================================================== */

  const handlePageChange = (page) => {
    setActivePage(page);
    setSelectedCourse(null);
    setSelectedOpportunity(null);
    setIsApplying(false);
    setApplicationSubmitted(false);
    setIsEditingProfile(false);

    if (page === "My Applications" && email) {
      loadApplications(email);
    }
  };

  /* =====================================================
     COURSE DETAILS
  ===================================================== */

  const openCourseDetails = (course) => {
    const current = courseProgress[course.id] || {
      progress: course.progress,
      completedModules: course.completedModules,
    };

    setSelectedCourse({
      ...course,
      progress: current.progress,
      completedModules: current.completedModules,
      status:
        current.progress === 100
          ? "Completed"
          : current.progress === 0
          ? "Not Started"
          : "In Progress",
    });
  };

  /* =====================================================
     COMPLETE NEXT MODULE
  ===================================================== */

  const completeNextModule = async (courseId) => {
    const course = courses.find(
      (item) => item.id === courseId
    );

    if (!course) return;

    const existing = courseProgress[courseId] || {
      progress: course.progress,
      completedModules: course.completedModules,
    };

    if (existing.completedModules >= course.modules) {
      return;
    }

    const nextCompletedModules =
      existing.completedModules + 1;

    const nextProgress = Math.round(
      (nextCompletedModules / course.modules) * 100
    );

    setCourseProgress((current) => ({
      ...current,
      [courseId]: {
        progress: nextProgress,
        completedModules: nextCompletedModules,
      },
    }));

    setSelectedCourse((currentCourse) => {
      if (
        !currentCourse ||
        currentCourse.id !== courseId
      ) {
        return currentCourse;
      }

      return {
        ...currentCourse,
        completedModules: nextCompletedModules,
        progress: nextProgress,
        status:
          nextProgress === 100
            ? "Completed"
            : "In Progress",
      };
    });

    const newActivity = {
      id: Date.now(),
      icon: "📘",
      title: `Completed a module in ${course.title}`,
      description:
        "You made progress in your learning path.",
      time: "Just now",
    };

    setActivities((current) => [
      newActivity,
      ...current,
    ]);

    try {
      if (email) {
        const progressResponse = await fetch(
          `${API_URL}/user/${encodeURIComponent(
            email
          )}/progress/${courseId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              progress: nextProgress,
              completedModules:
                nextCompletedModules,
            }),
          }
        );

        if (!progressResponse.ok) {
          console.log(
            "Progress could not be saved."
          );
        }

        await fetch(
          `${API_URL}/user/${encodeURIComponent(
            email
          )}/activity`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              icon: newActivity.icon,
              title: newActivity.title,
              description: newActivity.description,
              time: newActivity.time,
            }),
          }
        );
      }
    } catch (error) {
      console.log(
        "Backend progress save error:",
        error
      );
    }

    alert("Module completed successfully!");
  };

  /* =====================================================
     OPPORTUNITIES
  ===================================================== */

  const openOpportunityDetails = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsApplying(false);
    setApplicationSubmitted(false);
  };

  const backToOpportunities = () => {
    setSelectedOpportunity(null);
    setIsApplying(false);
    setApplicationSubmitted(false);
  };

  const startApplication = () => {
    setApplicationData({
      phone: "",
      resume: "",
      coverNote: "",
    });

    setApplicationSubmitted(false);
    setIsApplying(true);
  };

  const backToOpportunityDetails = () => {
    setIsApplying(false);
    setApplicationSubmitted(false);
  };

  const handleApplicationChange = (e) => {
    const { name, value } = e.target;

    setApplicationData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /* =====================================================
     APPLICATION
  ===================================================== */

  const submitApplication = async (e) => {
    e.preventDefault();

    if (
      !applicationData.phone.trim() ||
      !applicationData.resume.trim() ||
      !applicationData.coverNote.trim()
    ) {
      alert("Please fill all application fields.");
      return;
    }

    if (!selectedOpportunity || !email) {
      alert("Unable to submit application.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/user/${encodeURIComponent(
          email
        )}/applications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            opportunityId: selectedOpportunity.id,
            opportunityTitle:
              selectedOpportunity.title,
            company: selectedOpportunity.company,
            phone: applicationData.phone,
            resume: applicationData.resume,
            coverNote: applicationData.coverNote,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to submit application."
        );
        return;
      }

      setApplicationSubmitted(true);

      const newActivity = {
        id: Date.now(),
        icon: "🎯",
        title: `Applied for ${selectedOpportunity.title}`,
        description: `Application submitted to ${selectedOpportunity.company}.`,
        time: "Just now",
      };

      setActivities((current) => [
        newActivity,
        ...current,
      ]);

      /* SAVE APPLICATION ACTIVITY */
      await fetch(
        `${API_URL}/user/${encodeURIComponent(
          email
        )}/activity`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            icon: newActivity.icon,
            title: newActivity.title,
            description: newActivity.description,
            time: newActivity.time,
          }),
        }
      );

      /* REFRESH APPLICATIONS */
      await loadApplications(email);
    } catch (error) {
      alert("Unable to connect to server.");
    }
  };

  /* =====================================================
     PROFILE EDIT
  ===================================================== */

  const openProfileEdit = () => {
    setEditName(name);
    setEditEmail(email);
    setIsEditingProfile(true);
  };

  const cancelProfileEdit = () => {
    setEditName(name);
    setEditEmail(email);
    setIsEditingProfile(false);
  };

  const saveProfileChanges = async () => {
    if (!editName.trim() || !editEmail.trim()) {
      alert("Name and email cannot be empty.");
      return;
    }

    const oldEmail = email;

    try {
      const response = await fetch(
        `${API_URL}/user/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldEmail,
            name: editName.trim(),
            email: editEmail.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to update profile."
        );
        return;
      }

      const updatedName =
        data.user?.name || editName.trim();

      const updatedEmail =
        data.user?.email || editEmail.trim();

      setName(updatedName);
      setEmail(updatedEmail);
      setIsEditingProfile(false);

      localStorage.setItem(
        "skillbridgeName",
        updatedName
      );

      localStorage.setItem(
        "skillbridgeEmail",
        updatedEmail
      );

      const newActivity = {
        id: Date.now(),
        icon: "👤",
        title: "Profile updated",
        description:
          "Your SkillBridge profile information was updated.",
        time: "Just now",
      };

      setActivities((current) => [
        newActivity,
        ...current,
      ]);

      await fetch(
        `${API_URL}/user/${encodeURIComponent(
          updatedEmail
        )}/activity`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            icon: newActivity.icon,
            title: newActivity.title,
            description: newActivity.description,
            time: newActivity.time,
          }),
        }
      );

      /* LOAD APPLICATIONS USING NEW EMAIL */
      await loadApplications(updatedEmail);

      alert("Profile updated successfully!");
    } catch (error) {
      alert("Unable to connect to server.");
    }
  };

  /* =====================================================
     DASHBOARD
  ===================================================== */

  const renderDashboard = () => {
    const currentCourse = updatedCourses[0];

    return (
      <section className="page-section">
        <div className="welcome-card">
          <div className="welcome-content">
            <span className="small-label">
              WELCOME BACK
            </span>

            <h1>
              Build your skills. Shape your future.
            </h1>

            <p>
              Continue learning, improve your skills and
              discover new opportunities.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                handlePageChange("Courses")
              }
            >
              Start Learning →
            </button>
          </div>

          <div className="welcome-visual">
            <div className="floating-circle circle-one">
              💡
            </div>

            <div className="floating-circle circle-two">
              🚀
            </div>

            <div className="main-rocket">
              🚀
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card stat-blue">
            <span>📚</span>
            <div>
              <strong>12</strong>
              <p>Courses Enrolled</p>
            </div>
          </div>

          <div className="stat-card stat-purple">
            <span>💡</span>
            <div>
              <strong>05</strong>
              <p>Skills</p>
            </div>
          </div>

          <div className="stat-card stat-orange">
            <span>🏆</span>
            <div>
              <strong>08</strong>
              <p>Achievements</p>
            </div>
          </div>

          <div className="stat-card stat-green">
            <span>💼</span>
            <div>
              <strong>06</strong>
              <p>Career Opportunities</p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="section-heading">
              <div>
                <span className="small-label">
                  CURRENT LEARNING
                </span>

                <h2>{currentCourse.title}</h2>
              </div>

              <button
                className="text-button"
                onClick={() =>
                  openCourseDetails(currentCourse)
                }
              >
                View Course →
              </button>
            </div>

            <div className="progress-row">
              <span>
                {currentCourse.completedModules} of{" "}
                {currentCourse.modules} modules
              </span>

              <strong>
                {currentCourse.progress}%
              </strong>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${currentCourse.progress}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="dashboard-card activity-card">
            <div className="section-heading">
              <div>
                <span className="small-label">
                  RECENT ACTIVITY
                </span>

                <h2>Your latest updates</h2>
              </div>
            </div>

            <div className="activity-list">
              {activities
                .slice(0, 5)
                .map((activity) => (
                  <div
                    className="activity-item"
                    key={activity.id}
                  >
                    <div className="activity-icon">
                      {activity.icon}
                    </div>

                    <div className="activity-content">
                      <strong>
                        {activity.title}
                      </strong>

                      <p>
                        {activity.description}
                      </p>
                    </div>

                    <span className="activity-time">
                      {activity.time}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  /* =====================================================
     COURSES
  ===================================================== */

  const renderCourses = () => {
    if (selectedCourse) {
      const completed =
        selectedCourse.completedModules;

      return (
        <section className="page-section">
          <button
            className="back-button"
            onClick={() =>
              setSelectedCourse(null)
            }
          >
            ← Back to Courses
          </button>

          <div className="course-detail-header">
            <div className="course-detail-icon">
              {selectedCourse.icon}
            </div>

            <div>
              <span className="small-label">
                {selectedCourse.category}
              </span>

              <h1>{selectedCourse.title}</h1>

              <p>
                {selectedCourse.status} • {completed}/
                {selectedCourse.modules} modules
                completed
              </p>
            </div>
          </div>

          <div className="course-detail-grid">
            <div className="detail-card">
              <span className="small-label">
                YOUR PROGRESS
              </span>

              <div className="large-progress">
                {selectedCourse.progress}%
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${selectedCourse.progress}%`,
                  }}
                ></div>
              </div>

              <p className="muted-text">
                {completed} of{" "}
                {selectedCourse.modules} modules
                completed.
              </p>

              {completed <
              selectedCourse.modules ? (
                <button
                  className="primary-button"
                  onClick={() =>
                    completeNextModule(
                      selectedCourse.id
                    )
                  }
                >
                  Complete Next Module
                </button>
              ) : (
                <div className="completed-message">
                  🎉 Course Completed!
                </div>
              )}
            </div>

            <div className="detail-card">
              <span className="small-label">
                ALL MODULES
              </span>

              <div className="module-list">
                {selectedCourse.modulesList.map(
                  (module, index) => {
                    const moduleNumber =
                      index + 1;

                    const isCompleted =
                      moduleNumber <= completed;

                    const isCurrent =
                      moduleNumber ===
                      completed + 1;

                    return (
                      <div
                        className={`module-item ${
                          isCurrent
                            ? "current-module"
                            : ""
                        }`}
                        key={module}
                      >
                        <div
                          className={`module-indicator ${
                            isCompleted
                              ? "completed"
                              : ""
                          }`}
                        >
                          {isCompleted
                            ? "✓"
                            : moduleNumber}
                        </div>

                        <div>
                          <strong>
                            {module}
                          </strong>

                          <span>
                            {isCompleted
                              ? "Completed"
                              : isCurrent
                              ? "Current Module"
                              : "Not Started"}
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </section>
      );
    }

    const filteredCourses =
      updatedCourses.filter((course) => {
        const matchesSearch =
          course.title
            .toLowerCase()
            .includes(
              courseSearch.toLowerCase()
            );

        const matchesCategory =
          courseCategory === "All" ||
          course.category === courseCategory;

        const matchesStatus =
          courseStatus === "All" ||
          course.status === courseStatus;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesStatus
        );
      });

    return (
      <section className="page-section">
        <div className="page-title">
          <span className="small-label">
            LEARNING
          </span>

          <h1>Courses</h1>

          <p>
            Build practical skills through structured
            learning paths.
          </p>
        </div>

        <div className="filter-panel">
          <div className="search-box">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search courses..."
              value={courseSearch}
              onChange={(e) =>
                setCourseSearch(e.target.value)
              }
            />
          </div>

          <select
            value={courseCategory}
            onChange={(e) =>
              setCourseCategory(e.target.value)
            }
          >
            <option value="All">
              All Categories
            </option>

            <option value="Web Development">
              Web Development
            </option>

            <option value="Design">
              Design
            </option>

            <option value="Programming">
              Programming
            </option>

            <option value="Soft Skills">
              Soft Skills
            </option>
          </select>

          <select
            value={courseStatus}
            onChange={(e) =>
              setCourseStatus(e.target.value)
            }
          >
            <option value="All">
              All Status
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Not Started">
              Not Started
            </option>
          </select>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="empty-state">
            <div>🔎</div>

            <h2>No courses found</h2>

            <p>
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="course-grid">
            {filteredCourses.map((course) => (
              <div
                className="course-card"
                key={course.id}
              >
                <div className="course-icon">
                  {course.icon}
                </div>

                <span className="course-category">
                  {course.category}
                </span>

                <h2>{course.title}</h2>

                <div className="progress-row">
                  <span>
                    {course.completedModules}/
                    {course.modules} modules
                  </span>

                  <strong>
                    {course.progress}%
                  </strong>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${course.progress}%`,
                    }}
                  ></div>
                </div>

                <span
                  className={`status-badge ${course.status
                    .toLowerCase()
                    .replaceAll(" ", "-")}`}
                >
                  {course.status}
                </span>

                <button
                  className="secondary-button"
                  onClick={() =>
                    openCourseDetails(course)
                  }
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  /* =====================================================
     OPPORTUNITIES
  ===================================================== */

  const renderOpportunities = () => {
    if (
      selectedOpportunity &&
      isApplying
    ) {
      if (applicationSubmitted) {
        return (
          <section className="page-section">
            <div className="application-success">
              <div className="success-icon">
                ✓
              </div>

              <h1>
                Application Submitted
                Successfully!
              </h1>

              <p>
                Your application has been
                submitted successfully. You
                can continue exploring other
                opportunities.
              </p>

              <div className="success-details">
                <div>
                  <span>APPLICANT</span>

                  <strong>{name}</strong>
                </div>

                <div>
                  <span>POSITION</span>

                  <strong>
                    {selectedOpportunity.title}
                  </strong>
                </div>

                <div>
                  <span>COMPANY</span>

                  <strong>
                    {selectedOpportunity.company}
                  </strong>
                </div>
              </div>

              <button
                className="primary-button"
                onClick={() => {
                  setSelectedOpportunity(null);
                  setIsApplying(false);
                  setApplicationSubmitted(false);
                  setActivePage("Dashboard");
                }}
              >
                Go to Dashboard →
              </button>
            </div>
          </section>
        );
      }

      return (
        <section className="page-section">
          <button
            className="back-button"
            onClick={
              backToOpportunityDetails
            }
          >
            ← Back to Opportunity
          </button>

          <div className="application-header">
            <div className="application-header-icon">
              {selectedOpportunity.icon}
            </div>

            <div>
              <span className="small-label">
                JOB APPLICATION
              </span>

              <h1>
                {selectedOpportunity.title}
              </h1>

              <p>
                {selectedOpportunity.company}
              </p>
            </div>
          </div>

          <div className="application-layout">
            <div className="application-form-card">
              <span className="small-label">
                APPLICATION FORM
              </span>

              <h2>
                Tell us about yourself
              </h2>

              <p className="application-intro">
                Complete the application form
                below to apply for this
                opportunity.
              </p>

              <form
                onSubmit={submitApplication}
              >
                <div className="application-form-grid">
                  <label>
                    Full Name

                    <input
                      value={name}
                      readOnly
                    />
                  </label>

                  <label>
                    Email

                    <input
                      value={email}
                      readOnly
                    />
                  </label>

                  <label>
                    Phone Number

                    <input
                      type="tel"
                      name="phone"
                      value={
                        applicationData.phone
                      }
                      onChange={
                        handleApplicationChange
                      }
                      placeholder="Enter your phone number"
                    />
                  </label>

                  <label>
                    Resume Link

                    <input
                      type="url"
                      name="resume"
                      value={
                        applicationData.resume
                      }
                      onChange={
                        handleApplicationChange
                      }
                      placeholder="https://..."
                    />
                  </label>
                </div>

                <label className="application-full-field">
                  Cover Note

                  <textarea
                    name="coverNote"
                    value={
                      applicationData.coverNote
                    }
                    onChange={
                      handleApplicationChange
                    }
                    placeholder="Write a short note about why you are interested..."
                  ></textarea>
                </label>

                <button
                  type="submit"
                  className="submit-application-button"
                >
                  Submit Application →
                </button>
              </form>
            </div>

            <div className="application-summary-card">
              <span className="small-label">
                OPPORTUNITY
              </span>

              <h2>
                {selectedOpportunity.title}
              </h2>

              <p>
                {selectedOpportunity.company}
              </p>

              <div className="application-summary-list">
                <div>
                  <span>LOCATION</span>

                  <strong>
                    {selectedOpportunity.location}
                  </strong>
                </div>

                <div>
                  <span>WORK MODE</span>

                  <strong>
                    {selectedOpportunity.mode}
                  </strong>
                </div>

                <div>
                  <span>STIPEND</span>

                  <strong>
                    {selectedOpportunity.stipend}
                  </strong>
                </div>

                <div>
                  <span>DEADLINE</span>

                  <strong>
                    {selectedOpportunity.deadline}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (selectedOpportunity) {
      const alreadyApplied = applications.some(
        (application) =>
          Number(application.opportunityId) ===
          Number(selectedOpportunity.id)
      );

      return (
        <section className="page-section">
          <button
            className="back-button"
            onClick={backToOpportunities}
          >
            ← Back to Opportunities
          </button>

          <div className="opportunity-detail-hero">
            <div className="opportunity-detail-icon">
              {selectedOpportunity.icon}
            </div>

            <div>
              <span className="small-label">
                {selectedOpportunity.type}
              </span>

              <h1>
                {selectedOpportunity.title}
              </h1>

              <p>
                {selectedOpportunity.company}
              </p>

              <div className="opportunity-meta">
                <span>
                  📍{" "}
                  {selectedOpportunity.location}
                </span>

                <span>
                  💼 {selectedOpportunity.mode}
                </span>

                <span>
                  💰{" "}
                  {selectedOpportunity.stipend}
                </span>
              </div>
            </div>
          </div>

          <div className="opportunity-detail-grid">
            <div className="opportunity-detail-main">
              <div className="detail-section">
                <span className="small-label">
                  ABOUT THE ROLE
                </span>

                <h2>Role Description</h2>

                <p>
                  {selectedOpportunity.description}
                </p>
              </div>

              <div className="detail-section">
                <span className="small-label">
                  REQUIRED SKILLS
                </span>

                <h2>Skills</h2>

                <div className="skill-tags">
                  {selectedOpportunity.skills.map(
                    (skill) => (
                      <span key={skill}>
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="detail-section">
                <span className="small-label">
                  ELIGIBILITY
                </span>

                <h2>
                  Who can apply?
                </h2>

                <p>
                  {selectedOpportunity.eligibility}
                </p>
              </div>
            </div>

            <div className="opportunity-info-card">
              <h2>
                Opportunity Details
              </h2>

              <div>
                <span>Company</span>

                <strong>
                  {selectedOpportunity.company}
                </strong>
              </div>

              <div>
                <span>Location</span>

                <strong>
                  {selectedOpportunity.location}
                </strong>
              </div>

              <div>
                <span>Work Mode</span>

                <strong>
                  {selectedOpportunity.mode}
                </strong>
              </div>

              <div>
                <span>Stipend</span>

                <strong>
                  {selectedOpportunity.stipend}
                </strong>
              </div>

              <div>
                <span>Deadline</span>

                <strong>
                  {selectedOpportunity.deadline}
                </strong>
              </div>

              {alreadyApplied ? (
                <div className="already-applied-message">
                  ✓ You have already applied
                </div>
              ) : (
                <button
                  className="primary-button full-width"
                  onClick={
                    startApplication
                  }
                >
                  Apply Now →
                </button>
              )}
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="page-section">
        <div className="page-title">
          <span className="small-label">
            CAREER
          </span>

          <h1>Opportunities</h1>

          <p>
            Explore internships and career
            opportunities.
          </p>
        </div>

        <div className="opportunity-grid">
          {opportunities.map(
            (opportunity) => {
              const alreadyApplied =
                applications.some(
                  (application) =>
                    Number(
                      application.opportunityId
                    ) === Number(opportunity.id)
                );

              return (
                <div
                  className="opportunity-card"
                  key={opportunity.id}
                >
                  <div className="opportunity-card-top">
                    <div className="opportunity-icon">
                      {opportunity.icon}
                    </div>

                    {alreadyApplied && (
                      <span className="applied-badge">
                        ✓ Applied
                      </span>
                    )}
                  </div>

                  <span className="course-category">
                    {opportunity.type}
                  </span>

                  <h2>
                    {opportunity.title}
                  </h2>

                  <p className="company-name">
                    {opportunity.company}
                  </p>

                  <div className="opportunity-card-info">
                    <span>
                      📍{" "}
                      {opportunity.location}
                    </span>

                    <span>
                      💼 {opportunity.mode}
                    </span>

                    <span>
                      💰{" "}
                      {opportunity.stipend}
                    </span>
                  </div>

                  <button
                    className="secondary-button"
                    onClick={() =>
                      openOpportunityDetails(
                        opportunity
                      )
                    }
                  >
                    View Details →
                  </button>
                </div>
              );
            }
          )}
        </div>
      </section>
    );
  };

  /* =====================================================
     MY APPLICATIONS
  ===================================================== */

  const renderApplications = () => {
    return (
      <section className="page-section">
        <div className="page-title">
          <span className="small-label">
            CAREER TRACKING
          </span>

          <h1>My Applications</h1>

          <p>
            Track the opportunities you have
            applied for.
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="applications-empty-state">
            <div className="applications-empty-icon">
              📄
            </div>

            <h2>No applications yet</h2>

            <p>
              You haven't applied for any
              opportunities yet.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                handlePageChange("Opportunities")
              }
            >
              Explore Opportunities →
            </button>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map(
              (application) => {
                const appliedDate =
                  application.createdAt
                    ? new Date(
                        application.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "Recently";

                return (
                  <div
                    className="my-application-card"
                    key={
                      application._id ||
                      `${application.opportunityId}-${application.createdAt}`
                    }
                  >
                    <div className="my-application-top">
                      <div className="my-application-icon">
                        💼
                      </div>

                      <div className="my-application-heading">
                        <span className="small-label">
                          APPLICATION
                        </span>

                        <h2>
                          {
                            application.opportunityTitle
                          }
                        </h2>

                        <p>
                          {application.company}
                        </p>
                      </div>

                      <span
                        className={`application-status-badge ${
                          (
                            application.status ||
                            "Applied"
                          )
                            .toLowerCase()
                            .replaceAll(
                              " ",
                              "-"
                            )
                        }`}
                      >
                        {application.status ||
                          "Applied"}
                      </span>
                    </div>

                    <div className="my-application-details">
                      <div>
                        <span>COMPANY</span>

                        <strong>
                          {application.company}
                        </strong>
                      </div>

                      <div>
                        <span>JOB ROLE</span>

                        <strong>
                          {
                            application.opportunityTitle
                          }
                        </strong>
                      </div>

                      <div>
                        <span>APPLIED DATE</span>

                        <strong>
                          {appliedDate}
                        </strong>
                      </div>

                      <div>
                        <span>STATUS</span>

                        <strong>
                          {application.status ||
                            "Applied"}
                        </strong>
                      </div>
                    </div>

                    <div className="my-application-bottom">
                      <div className="application-document-info">
                        <span>📄 Resume</span>

                        {application.resume ? (
                          <a
                            href={
                              application.resume
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Resume ↗
                          </a>
                        ) : (
                          <span>
                            Not provided
                          </span>
                        )}
                      </div>

                      <button
                        className="application-details-button"
                        onClick={() => {
                          const opportunity =
                            opportunities.find(
                              (item) =>
                                Number(
                                  item.id
                                ) ===
                                Number(
                                  application.opportunityId
                                )
                            );

                          if (opportunity) {
                            setSelectedOpportunity(
                              opportunity
                            );
                            setActivePage(
                              "Opportunities"
                            );
                          }
                        }}
                      >
                        View Opportunity →
                      </button>
                    </div>

                    <div className="application-note">
                      <span>
                        📝 Application Note
                      </span>

                      <p>
                        {application.coverNote ||
                          "No cover note provided."}
                      </p>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </section>
    );
  };

  /* =====================================================
     SKILLS
  ===================================================== */

  const renderSkills = () => {
    const filteredSkills =
      skills.filter((skill) => {
        const matchesSearch =
          skill.name
            .toLowerCase()
            .includes(
              skillSearch.toLowerCase()
            );

        const matchesCategory =
          skillCategory === "All" ||
          skill.category === skillCategory;

        return (
          matchesSearch &&
          matchesCategory
        );
      });

    return (
      <section className="page-section">
        <div className="page-title">
          <span className="small-label">
            DEVELOPMENT
          </span>

          <h1>Skills</h1>

          <p>
            Track and improve your technical
            and professional skills.
          </p>
        </div>

        <div className="filter-panel skill-filter-panel">
          <div className="search-box">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search skills..."
              value={skillSearch}
              onChange={(e) =>
                setSkillSearch(e.target.value)
              }
            />
          </div>

          <select
            value={skillCategory}
            onChange={(e) =>
              setSkillCategory(e.target.value)
            }
          >
            <option value="All">
              All Categories
            </option>

            <option value="Technical">
              Technical
            </option>

            <option value="Design">
              Design
            </option>

            <option value="Soft Skills">
              Soft Skills
            </option>
          </select>
        </div>

        {filteredSkills.length === 0 ? (
          <div className="empty-state">
            <div>🔎</div>

            <h2>No skills found</h2>

            <p>
              Try another search or category.
            </p>
          </div>
        ) : (
          <div className="skill-grid">
            {filteredSkills.map(
              (skill) => (
                <div
                  className="skill-card"
                  key={skill.name}
                >
                  <div className="skill-card-top">
                    <div className="skill-icon">
                      {skill.icon}
                    </div>

                    <strong>
                      {skill.progress}%
                    </strong>
                  </div>

                  <div className="skill-card-category">
                    {skill.category}
                  </div>

                  <h2>{skill.name}</h2>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${skill.progress}%`,
                      }}
                    ></div>
                  </div>

                  <p>
                    {skill.progress >= 70
                      ? "Strong"
                      : skill.progress >= 40
                      ? "Developing"
                      : "Beginner"}
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </section>
    );
  };

  /* =====================================================
     MY PROGRESS
  ===================================================== */

  const renderProgress = () => {
    const average = Math.round(
      updatedCourses.reduce(
        (total, course) =>
          total + course.progress,
        0
      ) / updatedCourses.length
    );

    return (
      <section className="page-section">
        <div className="page-title">
          <span className="small-label">
            YOUR JOURNEY
          </span>

          <h1>My Progress</h1>

          <p>
            See how far you have come in your
            learning journey.
          </p>
        </div>

        <div className="progress-overview">
          <div className="overview-card overview-blue">
            <span>
              Overall Progress
            </span>

            <strong>
              {average}%
            </strong>
          </div>

          <div className="overview-card overview-purple">
            <span>
              Completed Courses
            </span>

            <strong>
              {
                updatedCourses.filter(
                  (course) =>
                    course.progress === 100
                ).length
              }
            </strong>
          </div>

          <div className="overview-card overview-green">
            <span>
              Courses in Progress
            </span>

            <strong>
              {
                updatedCourses.filter(
                  (course) =>
                    course.progress > 0 &&
                    course.progress < 100
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="progress-course-list">
          {updatedCourses.map(
            (course) => (
              <div
                className="progress-course"
                key={course.id}
              >
                <div className="progress-course-info">
                  <span>
                    {course.icon}
                  </span>

                  <div>
                    <strong>
                      {course.title}
                    </strong>

                    <p>
                      {course.completedModules}/
                      {course.modules} modules
                    </p>
                  </div>
                </div>

                <div className="progress-course-bar">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${course.progress}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <strong>
                  {course.progress}%
                </strong>
              </div>
            )
          )}
        </div>
      </section>
    );
  };

  /* =====================================================
     PROFILE
  ===================================================== */

  const renderProfile = () => {
    return (
      <section className="page-section">
        <div className="page-title">
          <span className="small-label">
            ACCOUNT
          </span>

          <h1>Profile</h1>

          <p>
            Manage your SkillBridge profile
            information.
          </p>
        </div>

        <div className="profile-card">
          <div className="profile-top">
            <div className="profile-avatar">
              {name
                ? name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            <div className="profile-info">
              <h2>
                {name || "Student"}
              </h2>

              <p>
                {email ||
                  "student@skillbridge.com"}
              </p>

              <span>
                SkillBridge Student
              </span>
            </div>

            {!isEditingProfile && (
              <button
                className="edit-profile-button"
                onClick={
                  openProfileEdit
                }
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>

          {isEditingProfile && (
            <div className="profile-edit-box">
              <div className="profile-edit-heading">
                <div>
                  <span className="small-label">
                    PROFILE SETTINGS
                  </span>

                  <h2>
                    Edit your information
                  </h2>
                </div>
              </div>

              <div className="profile-form-grid">
                <label>
                  Full Name

                  <input
                    type="text"
                    value={editName}
                    onChange={(e) =>
                      setEditName(
                        e.target.value
                      )
                    }
                    placeholder="Enter your name"
                  />
                </label>

                <label>
                  Email Address

                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) =>
                      setEditEmail(
                        e.target.value
                      )
                    }
                    placeholder="Enter your email"
                  />
                </label>
              </div>

              <div className="profile-actions">
                <button
                  className="save-profile-button"
                  onClick={
                    saveProfileChanges
                  }
                >
                  ✓ Save Changes
                </button>

                <button
                  className="cancel-profile-button"
                  onClick={
                    cancelProfileEdit
                  }
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!isEditingProfile && (
            <div className="profile-details-grid">
              <div>
                <span>FULL NAME</span>

                <strong>
                  {name || "Student"}
                </strong>
              </div>

              <div>
                <span>
                  EMAIL ADDRESS
                </span>

                <strong>
                  {email ||
                    "student@skillbridge.com"}
                </strong>
              </div>

              <div>
                <span>
                  ACCOUNT TYPE
                </span>

                <strong>
                  Student
                </strong>
              </div>

              <div>
                <span>PLATFORM</span>

                <strong>
                  SkillBridge
                </strong>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  };

  /* =====================================================
     PAGE CONTENT
  ===================================================== */

  const renderPageContent = () => {
    if (activePage === "Dashboard")
      return renderDashboard();

    if (activePage === "Courses")
      return renderCourses();

    if (activePage === "Skills")
      return renderSkills();

    if (
      activePage === "Opportunities"
    )
      return renderOpportunities();

    if (activePage === "My Applications")
      return renderApplications();

    if (activePage === "My Progress")
      return renderProgress();

    if (activePage === "Profile")
      return renderProfile();

    return renderDashboard();
  };

  /* =====================================================
     LOGIN / REGISTER PAGE
  ===================================================== */

  if (!isLoggedIn) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-showcase">
            <div className="showcase-logo">
              <span>◆</span>
              SkillBridge
            </div>

            <div className="showcase-content">
              <span className="showcase-tag">
                LEARN • GROW • ACHIEVE
              </span>

              <h1>
                Your skills are the bridge
                to your future.
              </h1>

              <p>
                Learn new skills, track your
                progress and discover
                opportunities that help you
                move closer to your career
                goals.
              </p>

              <div className="showcase-features">
                <div>
                  <span>📚</span>

                  <div>
                    <strong>
                      Learn
                    </strong>

                    <small>
                      Build practical
                      skills
                    </small>
                  </div>
                </div>

                <div>
                  <span>📈</span>

                  <div>
                    <strong>
                      Grow
                    </strong>

                    <small>
                      Track your progress
                    </small>
                  </div>
                </div>

                <div>
                  <span>🚀</span>

                  <div>
                    <strong>
                      Achieve
                    </strong>

                    <small>
                      Discover career
                      opportunities
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <div className="showcase-decoration decoration-one"></div>

            <div className="showcase-decoration decoration-two"></div>

            <div className="showcase-orb">
              🚀
            </div>
          </div>

          <div className="auth-card">
            <div className="auth-mobile-logo">
              <span>◆</span>
              SkillBridge
            </div>

            <div className="auth-heading">
              <span className="auth-welcome">
                {isLogin
                  ? "WELCOME BACK"
                  : "GET STARTED"}
              </span>

              <h1>
                {isLogin
                  ? "Welcome back!"
                  : "Create your account"}
              </h1>

              <p>
                {isLogin
                  ? "Login to continue your learning journey."
                  : "Start building your skills and career."}
              </p>
            </div>

            <form
              onSubmit={
                isLogin
                  ? handleLogin
                  : handleRegister
              }
            >
              {!isLogin && (
                <label>
                  Full Name

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }
                    placeholder="Enter your name"
                  />
                </label>
              )}

              <label>
                Email Address

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  placeholder="Enter your email"
                />
              </label>

              <label>
                Password

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter your password"
                />
              </label>

              <button
                className="auth-button"
                type="submit"
              >
                {isLogin
                  ? "Login to SkillBridge →"
                  : "Create Account →"}
              </button>
            </form>

            <div className="auth-switch">
              <span>
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </span>

              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setPassword("");
                }}
              >
                {isLogin
                  ? "Create Account"
                  : "Login"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     MAIN APPLICATION
  ===================================================== */

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark">
            ◆
          </div>

          <div>
            <strong>
              SkillBridge
            </strong>

            <span>
              Learn. Grow. Achieve.
            </span>
          </div>
        </div>

        <div className="sidebar-section-title">
          MAIN MENU
        </div>

        <nav>
          {[
            ["Dashboard", "🏠"],
            ["Courses", "📚"],
            ["Skills", "💡"],
            ["Opportunities", "💼"],
            ["My Applications", "📄"],
            ["My Progress", "📊"],
            ["Profile", "👤"],
          ].map(
            ([page, icon]) => (
              <button
                key={page}
                className={`nav-item ${
                  activePage === page
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  handlePageChange(
                    page
                  )
                }
              >
                <span>{icon}</span>
                {page}
              </button>
            )
          )}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span>💡</span>

            <div>
              <strong>
                Keep learning!
              </strong>

              <small>
                Small progress every day.
              </small>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            ↪ Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="topbar-small">
              SKILLBRIDGE
            </span>

            <span className="topbar-title">
              {activePage}
            </span>
          </div>

          <div className="topbar-user">
            <div className="user-avatar">
              {name
                ? name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            <div>
              <strong>
                {name || "Student"}
              </strong>

              <span>
                {email ||
                  "student@skillbridge.com"}
              </span>
            </div>
          </div>
        </header>

        {renderPageContent()}
      </main>
    </div>
  );
}

export default App;