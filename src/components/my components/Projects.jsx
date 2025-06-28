import React, { useState } from "react";
import ProjectCard from "./ProjectCard";
import taskbase from "../../assets/taskbase.png"
import carhelp from "../../assets/carhelp.png"
import unote from "../../assets/unote.png"
import { SiFirebase, SiFlutter, SiMongodb, SiNodedotjs, SiReact } from "react-icons/si";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      title: "TaskBase",
      image: taskbase,
      description: "Taskbase is a freelance task marketplace where freelancers can bid on tasks and people can add tasks to get finished. It's a full-stack application using React, Node.js, MongoDB, and Firebase.",
      techStack: ["React", "Node.js", "MongoDB", "Firebase"],
      techIcon: [<SiReact />, <SiNodedotjs />, <SiMongodb />, <SiFirebase />],
      liveLink: "https://taskbase-c16cd.web.app/",
      githubLink: "https://github.com/Labib591/TaskBase",
      challenges: "Handling real-time bidding.",
      improvements: "Add escrow system, better notifications, rating system.",
    },
    {
      title: "Carhelp",
      image: carhelp,
      description: "Carhelp is car rental website where users can rent cars and manage their bookings. It's a full-stack application using React, Node.js, MongoDB, and Firebase.",
      techStack: ["React", "Node.js", "MongoDB", "Firebase"],
      techIcon: [<SiReact />, <SiNodedotjs />, <SiMongodb />, <SiFirebase />],
      liveLink: "https://carhelp-labib.web.app/",
      githubLink: "https://github.com/Labib591/TaskBase",
      challenges: "Booking overlap handling and date validations.",
      improvements: "Payment integration, real time car tracking.",
    },
    {
      title: "UNote",
      image: unote,
      description: "Unote is a note-taking and drawing app made with flutter. It hase state-management so that even if the app closes or restarts, the notes and drawings will be saved.",
      techStack: ["Flutter"],
      techIcon: [<SiFlutter />],
      liveLink: "",
      githubLink: "https://github.com/Labib591/Unote",
      challenges: "State persistence and canvas drawing optimization.",
      improvements: "Cloud sync, sharing, better UI polish.",
    }
  ];

  return (
    <div id="projects" className="font-main my-20 flex flex-col items-center gap-10">
      <h1 className="text-xl md:text-5xl font-bold text-center">Projects I am Proud Of</h1>

      <div className="flex flex-col gap-4 justify-center w-[80%] mx-auto">
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            {...project}
            onViewDetails={() => setSelectedProject(project)}
          />
        ))}
      </div>

      {/* Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center px-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full relative">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-2">{selectedProject.title}</h2>
            <img src={selectedProject.image} alt={selectedProject.title} className="rounded mb-4" />
            <p className="text-gray-700 mb-4">{selectedProject.description}</p>

            <div className="mb-4">
              <h3 className="font-semibold">Tech Stack:</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedProject.techStack.map((tech, idx) => (
                  <span key={idx} className="bg-purple-400 px-2 py-1 rounded-full flex items-center text-sm text-gray-50">
                    {selectedProject.techIcon[idx]} <span className="ml-1">{tech}</span>
                  </span>
                ))}
              </div>
            </div>

            <p className="mb-2"><strong>Challenges:</strong> {selectedProject.challenges}</p>
            <p className="mb-4"><strong>Future Plans:</strong> {selectedProject.improvements}</p>

            <div className="flex gap-4">
              <a href={selectedProject.liveLink} target="_blank" rel="noopener noreferrer" className="text-purple-400 flex items-center gap-1 hover:underline">
                <FaExternalLinkAlt /> Live
              </a>
              <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer" className="text-gray-800 flex items-center gap-1 hover:underline">
                <FaGithub /> GitHub
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
