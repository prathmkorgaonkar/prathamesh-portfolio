import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/navbar";
import Hero from "./sections/Hero/hero";
import About from "./sections/About/about";
import Skills from "./sections/Skills/skills";
import Projects from "./sections/Projects/projects";
import Experience from "./sections/Experience/experience";
import Contact from "./sections/Contact/contact";
import Footer from "./components/footer";
import AdminLogin from "./sections/admin/adminLogin";
import AdminDashboard from "./sections/admin/adminDashboard";
import AdminLayout from "./components/layout/adminLayout";
import ProjectsManagement from "./sections/admin/projectsManagement";
import SkillsManagement from "./sections/admin/skillsManagement";
import ExperienceManagement from "./sections/admin/experienceManagement";
import ContactsManagement from "./sections/admin/contactsManagement";
import ProtectedRoute from "./components/auth/protectedRoute";


function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("portfolio-theme");

    return savedTheme === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );

    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) =>
      current === "light" ? "dark" : "light"
    );
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* Public Portfolio */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-white transition-colors dark:bg-gray-950">

              <Navbar
                theme={theme}
                toggleTheme={toggleTheme}
              />

              <main>
                <Hero />
                <About />
                <Skills />
                <Projects />
                <Experience />
                <Contact />
              </main>

              <Footer />

            </div>
          }
        />

        {/* Admin Panel */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="projects" element={<ProjectsManagement />} />
            <Route path="skills" element={<SkillsManagement />} />
            <Route path="experience" element={<ExperienceManagement />} />
            <Route path="contacts" element={<ContactsManagement />} />
          </Route>
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;