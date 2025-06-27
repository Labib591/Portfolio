import React from "react";
import {
  SiC,
  SiCplusplus,
  SiDart,
  SiExpress,
  SiFirebase,
  SiFlutter,
  SiGit,
  SiJavascript,
  SiMongodb,
  SiNodedotjs,
  SiReact,
  SiTailwindcss,
  SiVercel,
} from "react-icons/si";

const techStack = {
  Languages: [
    { name: "C++", logo: <SiCplusplus /> },
    { name: "C", logo: <SiC /> },
    { name: "JavaScript", logo: <SiJavascript /> },
    { name: "Dart", logo: <SiDart /> },
  ],
  "Libraries & Frameworks": [
    { name: "React", logo: <SiReact /> },
    { name: "Flutter", logo: <SiFlutter /> },
    { name: "Node.js", logo: <SiNodedotjs /> },
    { name: "Express.js", logo: <SiExpress /> },
    { name: "Tailwind CSS", logo: <SiTailwindcss /> },
  ],
  "Databases & Platforms": [
    { name: "MongoDB", logo: <SiMongodb /> },
    { name: "Firebase", logo: <SiFirebase /> },
    { name: "Vercel", logo: <SiVercel /> },
    { name: "Git", logo: <SiGit /> },
  ],
};

const Skills = () => {
  return (
    <section id="skills" className="font-main py-16 px-4 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl md:text-5xl font-bold text-center mb-12 text-gray-950 dark:text-white">
          My Tech Stack
        </h2>
        {Object.entries(techStack).map(([category, tools], index) => (
          <div key={index} className="mb-10">
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              {category}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {tools.map((tech, idx) => (
                <div
                  key={idx}
                  className="group flex flex-col gap-2 items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:bg-gray-950 transition-all duration-300"
                >
                  <div className="text-4xl text-gray-700 dark:text-gray-200 group-hover:text-orange-500 transition-colors duration-300">
                    {tech.logo}
                  </div>
                  <p className="text-xl font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-50 transition-colors duration-300">
                    {tech.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
