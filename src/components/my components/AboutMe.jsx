import React from "react";

const AboutMe = () => {
  return (
    <section className="font-main py-16 px-4 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold italic">
          About Me
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mt-6 text-lg md:text-xl leading-relaxed">
          Hi, I’m <span className="font-semibold text-blue-600 dark:text-blue-400">Mahir</span>! 👋 <br />
          My programming journey began during the quiet days of the{" "}
          <span className="italic">COVID-19 lockdown</span>. What started as
          curiosity quickly became a <span className="font-medium text-green-600 dark:text-green-400">passion</span>.
          I started with <span className="font-semibold">C++</span>, diving deep into the world of algorithms and logic.
          Later, I explored <span className="font-semibold">Flutter</span> for mobile development, and eventually found
          my home in <span className="font-semibold">web development</span>, where I love building interactive and 
          meaningful user experiences.
        </p>

        <p className="text-gray-700 dark:text-gray-300 mt-6 text-lg md:text-xl leading-relaxed">
          Off the screen, I'm a huge <span className="text-orange-500 font-semibold">cricket lover</span> 🏏—whether it’s 
          playing matches or staying up late to watch my favorite teams. I'm also passionate about 
          <span className="text-purple-500 font-semibold"> reading</span>, especially books that offer new perspectives 
          or tell unforgettable stories.
        </p>

        <p className="text-gray-700 dark:text-gray-300 mt-6 text-lg md:text-xl leading-relaxed">
          Always curious, always building—whether it’s the next line of code or the next chapter of life.
        </p>
      </div>
    </section>
  );
};

export default AboutMe;
