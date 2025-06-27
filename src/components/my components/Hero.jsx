import React from "react";
import dp from "../../assets/dp.png";
import { FaArrowCircleDown, FaGithub, FaLinkedin } from "react-icons/fa";
import { SiCodeforces } from "react-icons/si";
import { Button } from "../ui/button";
// import { P } from "framer-motion/dist/types.d-BSoEx4Ea";

const Hero = () => {
  return (
    <section className="relative w-full mt-10 font-main flex items-center justify-center bg-white overflow-hidden">
      <div className="z-10 text-center px-4 flex flex-col items-center gap-3">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2">
          Hi, I'm <span className="italic text-black">Mahir!</span>
        </h1>
        <p className="text-gray-600 text-lg sm:text-xl mb-8">
          Web Developer, designer and an avid cricket lover
        </p>

        <div className="absolute top-50 inset-0 overflow-hidden z-10 pointer-events-none">
          <div className="whitespace-nowrap animate-marquee text-5xl md:text-[8vw] font-extrabold text-black/10 tracking-tight">
            <span className="mx-4">DESIGN & DEVELOP</span>
            <span className="mx-4">DESIGN & DEVELOP</span>
            <span className="mx-4">DESIGN & DEVELOP</span>
            <span className="mx-4">DESIGN & DEVELOP</span>
          </div>
        </div>
        <div className="relative z-20 mx-auto w-88 h-75 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img src={dp} alt="Yash" className="w-full h-full" />
        </div>

        <div className="flex justify-center mt-4 gap-4">
          <a href="https://github.com/Labib591" target="_blank">
            <FaGithub className="text-3xl hover:text-orange-500" />
          </a>
          <a
            href="https://www.linkedin.com/in/mahir-mohammed-labib-bb3085209/"
            target="_blank"
          >
            <FaLinkedin className="text-3xl hover:text-orange-500" />
          </a>
          <a href="https://codeforces.com/profile/useless591" target="_blank">
            <SiCodeforces className="text-3xl hover:text-orange-500" />
          </a>
        </div>
        <div className="mt-4">
          <a href="/Resume.pdf" download="Mahir_Labib_Resume.pdf">
            <Button
              variant="default"
              className="bg-orange-500 border-4 border-orange-200 text-lg px-6 py-6 w-[200px] rounded-full hover:bg-orange-600"
            >
              My Resume <FaArrowCircleDown />
            </Button>
          </a>
        </div>
      </div>

      <style>
        {`
          
          @keyframes marquee {
            100% { transform: translateX(100%); }
            0% { transform: translateX(-100%); }
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
