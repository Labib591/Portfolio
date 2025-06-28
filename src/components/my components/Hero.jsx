import React from "react";
import dp from "../../assets/dp.png";
import { FaArrowCircleDown, FaGithub, FaLinkedin } from "react-icons/fa";
import { SiCodeforces } from "react-icons/si";
import { Button } from "../ui/button";

const Hero = () => {
  return (
    <section className="relative w-full mt-10 font-main flex items-center justify-center bg-white overflow-hidden">
      {/* Marquee Wrapper with overflow hidden */}
      <div className="absolute top-[17rem] md:top-60 inset-x-0 z-10 pointer-events-none overflow-hidden w-full">
        <div className="animate-marquee whitespace-nowrap text-4xl sm:text-5xl md:text-[8vw] font-extrabold text-black/50 tracking-tight w-max">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="mx-4">
              DESIGN & DEVELOP
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="z-20 text-center px-4 flex flex-col items-center gap-3 max-w-full">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2">
          Hi, I'm <span className="italic text-black">Mahir!</span>
        </h1>

        <p className="text-gray-600 text-lg sm:text-xl mb-8">
          Web Developer, designer and an avid cricket lover
        </p>

        <div className="relative z-20 mx-auto w-full max-w-[22rem] h-[18.75rem] rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img src={dp} alt="mahir" className="w-full h-full object-cover" />
        </div>

        {/* Social Icons */}
        <div className="flex justify-center mt-4 gap-4">
          <a href="https://github.com/Labib591" target="_blank" rel="noreferrer">
            <FaGithub className="text-3xl hover:text-purple-500" />
          </a>
          <a
            href="https://www.linkedin.com/in/mahir-mohammed-labib-bb3085209/"
            target="_blank"
            rel="noreferrer"
          >
            <FaLinkedin className="text-3xl hover:text-purple-500" />
          </a>
          <a href="https://codeforces.com/profile/useless591" target="_blank" rel="noreferrer">
            <SiCodeforces className="text-3xl hover:text-purple-500" />
          </a>
        </div>

        {/* Resume Button */}
        <div className="mt-4">
          <a href="/Resume.pdf" download="Mahir_Labib_Resume.pdf">
            <Button
              variant="default"
              className="group bg-purple-500 border-4 border-purple-200 text-xl px-6 py-6 w-[200px] rounded-full hover:bg-purple-600 hover:scale-105 flex items-center justify-center gap-2"
            >
              My Resume
              <span className="text-5xl transition-transform duration-500 group-hover:rotate-270">
                <FaArrowCircleDown />
              </span>
            </Button>
          </a>
        </div>
      </div>

      {/* Keyframes Style */}
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-marquee {
            animation: marquee 20s linear infinite;
          }
        `}
      </style>
    </section>
  );
};

export default Hero;
