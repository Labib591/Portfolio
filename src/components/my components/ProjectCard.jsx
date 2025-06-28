import React, { useEffect } from "react";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import AOS from 'aos';
import 'aos/dist/aos.css';

const ProjectCard = ({
  image,
  title,
  description,
  techStack,
  techIcon,
  liveLink,
  githubLink,
  onViewDetails 
}) => {

  useEffect(() => {
    AOS.init({
      duration: 1000, // duration of animation in ms
      once: false,     // whether animation should happen only once
    });
  }, []);

  return (
    <div data-aos="fade-left" className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:scale-105 transition-all duration-300">
      {/* Left Side - Image */}
      <div className="md:w-1/2 w-full h-64 md:h-auto">
        <img src={image} alt={title} className="object-cover w-full h-full" />
      </div>

      {/* Right Side - Content */}
      <div className="p-6 md:w-1/2 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
          {/* Tech Stack */}
          <div className="mb-4">
            <h3 className="font-medium text-gray-700 mb-1">Tech Stack:</h3>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, index) => (
                <span
                  key={index}
                  className="bg-purple-400 flex items-center text-gray-50 px-2 py-1 rounded-full text-sm"
                >
                  {techIcon[index]}
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-4 mt-4">
          <a
            href={liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 flex items-center gap-1 hover:underline"
          >
            <FaExternalLinkAlt /> Live
          </a>
          <a
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 flex items-center gap-1 hover:underline"
          >
            <FaGithub /> GitHub
          </a>
        </div>

        <button
          onClick={onViewDetails}
          className="mt-4 bg-purple-500 rounded-full border-4 border-purple-200 text-white px-4 py-2 hover:bg-purple-600"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
