import { useEffect, useState } from "react";
import type { Project } from "../../types/project";
import { getAllProjects } from "../../api/project.api";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getAllProjects();
        setProjects(response.data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError("Unable to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <p className="text-center py-10">Loading projects...</p>;
  }

  if (error) {
    return <p className="text-center py-10 text-red-500">{error}</p>;
  }

  return (
    <section
      id="projects"
      className="py-20 bg-white dark:bg-gray-950 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* Section Heading */}
        <h2 className="text-3xl font-bold mb-10 text-center
      text-gray-900 dark:text-white"
        >
          My Projects
        </h2>

        {/* Project Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {projects.map((project) => (
            <div
              key={project.id}
              className="
            rounded-xl
            border border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-900
            overflow-hidden
            shadow-sm hover:shadow-xl
            transition-all duration-300
          "
            >

              {/* {project.imageUrl && (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
              )} */}

              <div className="p-5">

                {/* Project Title */}
                <h3 className="
              text-xl font-semibold mb-3
              text-gray-900 dark:text-white
            ">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="
              text-gray-600 dark:text-gray-300
              mb-4 leading-relaxed
            ">
                  {project.description}
                </p>

                {/* Technology Stack */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.techStack.map((technology) => (
                    <span
                      key={technology}
                      className="
                    text-xs font-medium
                    px-3 py-1.5 rounded-full
                    bg-gray-100 dark:bg-gray-800
                    text-gray-700 dark:text-gray-200
                    border border-gray-200 dark:border-gray-700
                  "
                    >
                      {technology}
                    </span>
                  ))}
                </div>

                {/* Project Links */}
                <div className="flex gap-5">

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                    text-sm font-semibold
                    text-blue-600 dark:text-blue-400
                    hover:text-blue-800 dark:hover:text-blue-300
                    transition-colors
                  "
                    >
                      GitHub →
                    </a>
                  )}

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                    text-sm font-semibold
                    text-blue-600 dark:text-blue-400
                    hover:text-blue-800 dark:hover:text-blue-300
                    transition-colors
                  "
                    >
                      Live Demo →
                    </a>
                  )}

                </div>

              </div>
            </div>
          ))}

        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <p className="
        text-center
        text-gray-500 dark:text-gray-400
        py-10
      ">
            No projects available yet.
          </p>
        )}

      </div>
    </section>
  );
};

export default Projects;