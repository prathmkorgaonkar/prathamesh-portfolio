
import { ArrowRight, Download } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Hero = () => {
    return (
        <section
            id="home"
            className="flex min-h-[85vh] items-center bg-gray-50 px-6 py-20 dark:bg-gray-950"
        >
            <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-2">

                {/* Introduction */}
                <div>
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        Available for opportunities
                    </div>

                    <p className="mb-3 text-lg font-medium text-gray-600 dark:text-gray-400">
                        Hello, I'm
                    </p>

                    <h1 className="text-4xl font-bold leading-tight text-gray-900 dark:text-white md:text-6xl">
                        Prathamesh
                        <span className="block text-blue-600">
                            Korgaonkar
                        </span>
                    </h1>

                    <h2 className="mt-5 text-xl font-semibold text-gray-700 dark:text-gray-300 md:text-2xl">
                        Backend Developer | Node.js & TypeScript
                    </h2>

                    <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 dark:text-gray-400">
                        I build scalable backend applications, REST APIs
                        and database-driven solutions using Node.js,
                        Express.js, TypeScript and PostgreSQL.
                        I enjoy solving real-world problems through
                        clean and efficient code.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">

                        <a
                            href="#projects"
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
                        >
                            View Projects
                            <ArrowRight size={18} />
                        </a>

                        <a
                            href="/resume.pdf"
                            download
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-800 transition hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
                        >
                            Download Resume
                            <Download size={18} />
                        </a>
                    </div>

                    <div className="mt-8 flex items-center gap-5">
                        <a
                            href="https://github.com/prathmkorgaonkar/auth-backend"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="GitHub"
                            className="text-gray-600 transition hover:text-blue-600 dark:text-gray-400"
                        >
                            <FaGithub size={24} />
                        </a>

                        <a
                            href="https://www.linkedin.com/in/prathamesh-korgaonkar-b8772918a/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="LinkedIn"
                            className="text-gray-600 transition hover:text-blue-600 dark:text-gray-400"
                        >
                            <FaLinkedin size={24} />
                        </a>
                    </div>
                </div>


                {/* Profile Image */}
                <div className="flex justify-center">
                    <div className="h-72 w-72 overflow-hidden rounded-full border-8 border-blue-100 shadow-xl dark:border-gray-800 md:h-96 md:w-96">
                        <img
                            src="/images/Prath.jpeg"
                            alt="Prathamesh Korgaonkar - Backend Developer"
                            className="h-full w-full object-cover object-center"
                        />
                    </div>
                </div>


            </div>
        </section>
    );
};

export default Hero;
