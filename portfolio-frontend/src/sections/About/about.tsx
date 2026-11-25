
import {
  Code2,
  Database,
  Server,
  BriefcaseBusiness,
} from "lucide-react";

const About = () => {
  const highlights = [
    {
      icon: <Server size={24} />,
      title: "Backend Development",
      description: "Building REST APIs and server-side applications using Node.js and Express.js.",
    },
    {
      icon: <Database size={24} />,
      title: "Database Management",
      description: "Working with PostgreSQL, MySQL, TypeORM and database design.",
    },
    {
      icon: <Code2 size={24} />,
      title: "Full Stack Development",
      description: "Developing web applications using React, Angular and modern backend technologies.",
    },
    {
      icon: <BriefcaseBusiness size={24} />,
      title: "Business Applications",
      description: "Experience working on ERP and e-commerce application workflows.",
    },
  ];

  return (
    <section
      id="about"
      className="bg-white px-6 py-24 dark:bg-gray-900"
    >
      <div className="mx-auto max-w-6xl">

        {/* Section Heading */}
        <div className="mb-14 text-center">
          <p className="mb-3 font-semibold uppercase tracking-widest text-blue-600">
            Get to know me
          </p>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            About Me
          </h2>

          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-blue-600" />
        </div>

        <div className="grid items-start gap-12 md:grid-cols-2">

          {/* Introduction */}
          <div>
            <h3 className="mb-5 text-2xl font-bold text-gray-900 dark:text-white">
              Backend Developer passionate about building useful applications.
            </h3>

            <p className="mb-5 leading-8 text-gray-600 dark:text-gray-400">
              I'm a backend-focused software developer specializing
              in Node.js, Express.js, TypeScript and PostgreSQL.
              I enjoy developing REST APIs, designing database
              structures and building reliable application logic.
            </p>

            <p className="mb-5 leading-8 text-gray-600 dark:text-gray-400">
              I have worked on ERP and e-commerce application
              development, including backend services, database
              integration and business workflows. I also work
              with modern frontend technologies such as React
              and Angular.
            </p>

            <p className="leading-8 text-gray-600 dark:text-gray-400">
              My focus is on writing clean, maintainable code,
              learning new technologies and creating practical
              solutions to real-world problems.
            </p>

            <a
              href="#contact"
              className="mt-8 inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Let's Connect
            </a>
          </div>

          {/* Highlights */}
          <div className="grid gap-5 sm:grid-cols-2">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-gray-50 p-6 transition hover:-translate-y-1 hover:border-blue-300 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-blue-800"
              >
                <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  {item.icon}
                </div>

                <h4 className="mb-2 font-bold text-gray-900 dark:text-white">
                  {item.title}
                </h4>

                <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
