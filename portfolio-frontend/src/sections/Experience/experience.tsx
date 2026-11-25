import { useEffect, useState } from "react";
import type { Experience } from "../../types/experience";
import { getAllExperiences } from "../../api/experience.api";

const ExperienceSection = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await getAllExperiences();
        setExperiences(response.data);
      } catch (err) {
        console.error("Failed to fetch experiences:", err);
        setError("Unable to load experience.");
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (loading) {
    return <p className="py-10 text-center text-gray-600 dark:text-gray-300">
      Loading experience...
    </p>;
  }

  if (error) {
    return <p className="py-10 text-center text-red-500">{error}</p>;
  }

  return (
    <section
      id="experience"
      className="py-20 bg-white dark:bg-gray-950 transition-colors"
    >
      <div className="max-w-5xl mx-auto px-6">

        <h2 className="text-3xl font-bold text-center mb-12
          text-gray-900 dark:text-white">
          Professional Experience
        </h2>

        <div className="space-y-8">
          {experiences.map((experience) => (
            <div
              key={experience.id}
              className="p-6 rounded-xl border border-gray-200
                dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2">

                <div>
                  <h3 className="text-xl font-semibold text-gray-900
                    dark:text-white">
                    {experience.designation}
                  </h3>

                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    {experience.companyName}
                  </p>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(experience.startDate).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })}
                  {" - "}
                  {experience.isCurrent
                    ? "Present"
                    : experience.endDate
                      ? new Date(experience.endDate).toLocaleDateString("en-IN", {
                          month: "short",
                          year: "numeric",
                        })
                      : "Not specified"}
                </p>

              </div>

              <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                {experience.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                {experience.technologies.map((technology) => (
                  <span
                    key={technology}
                    className="px-3 py-1 rounded-full text-xs
                      bg-gray-200 dark:bg-gray-800
                      text-gray-700 dark:text-gray-200"
                  >
                    {technology}
                  </span>
                ))}
              </div>

            </div>
          ))}
        </div>

        {experiences.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No experience records available.
          </p>
        )}

      </div>
    </section>
  );
};

export default ExperienceSection;