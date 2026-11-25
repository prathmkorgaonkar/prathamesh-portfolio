import { useEffect, useState } from "react";
import type { Skill } from "../../types/skill";
import { getAllSkills } from "../../api/skill.api";

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await getAllSkills();
        setSkills(response.data);
      } catch (err) {
        console.error("Failed to fetch skills:", err);
        setError("Unable to load skills.");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (loading) {
    return (
      <p className="py-10 text-center text-gray-600 dark:text-gray-300">
        Loading skills...
      </p>
    );
  }

  if (error) {
    return (
      <p className="py-10 text-center text-red-500">
        {error}
      </p>
    );
  }

  // Group skills by category
  const groupedSkills = skills.reduce<Record<string, Skill[]>>(
    (groups, skill) => {
      if (!groups[skill.category]) {
        groups[skill.category] = [];
      }

      groups[skill.category].push(skill);
      return groups;
    },
    {}
  );

  return (
    <section
      id="skills"
      className="py-20 bg-gray-50 dark:bg-gray-950 transition-colors"
    >
      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-3xl font-bold text-center mb-12
          text-gray-900 dark:text-white"
        >
          Technical Skills
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div
              key={category}
              className="rounded-xl p-6 border border-gray-200
                dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <h3 className="text-xl font-semibold mb-6
                text-gray-900 dark:text-white"
              >
                {category}
              </h3>

              <div className="space-y-5">
                {categorySkills.map((skill) => (
                  <div key={skill.id}>

                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-700
                        dark:text-gray-200"
                      >
                        {skill.name}
                      </span>

                      <span className="text-sm text-gray-500
                        dark:text-gray-400"
                      >
                        {skill.proficiency}%
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full
                      bg-gray-200 dark:bg-gray-700"
                    >
                      <div
                        className="h-2 rounded-full bg-blue-600
                          dark:bg-blue-400 transition-all duration-500"
                        style={{
                          width: `${skill.proficiency}%`,
                        }}
                      />
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>

        {skills.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No skills available yet.
          </p>
        )}

      </div>
    </section>
  );
};

export default Skills;