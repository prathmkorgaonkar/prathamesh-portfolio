
import { ArrowUp, Code2, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navigation = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">

      <div className="mx-auto max-w-6xl px-6 py-12">

        <div className="grid gap-10 md:grid-cols-3">

          {/* Brand */}
          <div>
            <a
              href="#home"
              className="inline-flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white"
            >
              <Code2 className="text-blue-600" size={28} />
              Prathamesh<span className="text-blue-600">.</span>
            </a>

            <p className="mt-4 max-w-xs text-sm leading-7 text-gray-600 dark:text-gray-400">
              Backend Developer specializing in Node.js,
              TypeScript, Express.js and PostgreSQL.
              Building scalable and reliable web applications.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 font-bold text-gray-900 dark:text-white">
              Quick Links
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm text-gray-600 transition hover:text-blue-600 dark:text-gray-400"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="mb-5 font-bold text-gray-900 dark:text-white">
              Connect With Me
            </h3>

            <div className="flex gap-3">

              <a
                href="https://github.com/prathmkorgaonkar/auth-backend"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="rounded-lg border border-gray-300 p-3 text-gray-700 transition hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300"
              >
                <FaGithub size={20} />
              </a>

              <a
                href="https://www.linkedin.com/in/prathamesh-korgaonkar-b8772918a/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="rounded-lg border border-gray-300 p-3 text-gray-700 transition hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300"
              >
                <FaLinkedin size={20} />
              </a>

              <a
                href="mailto:prathmkorgaonkar@gmail.com"
                aria-label="Email"
                className="rounded-lg border border-gray-300 p-3 text-gray-700 transition hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300"
              >
                <Mail size={20} />
              </a>

            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-gray-200 pt-6 dark:border-gray-800 md:flex-row">

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} Prathamesh Korgaonkar. All rights reserved.
          </p>

          <a
            href="#home"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
          >
            Back to Top
            <ArrowUp size={17} />
          </a>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
