
import { Sun, Moon, Code2, Menu, X } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const Navbar = ({ theme, toggleTheme }: NavbarProps) => {
  const [mobileMenu, setMobileMenu] = useState(false);

  const links = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/90">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        <a href="#home" className="flex items-center gap-2">
          <Code2 className="text-blue-600" size={28} />
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Prathamesh<span className="text-blue-600">.</span>
          </span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-gray-600 transition hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-full border border-gray-200 p-2 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
          </button>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle navigation"
            className="rounded-lg p-2 text-gray-700 dark:text-white md:hidden"
          >
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {mobileMenu && (
        <div className="border-t border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-950 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenu(false)}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
