import React from "react";
import logo from "../../assets/logo.jpg";
import { Button } from "../ui/button";

const Navbar = () => {
  const links = (
    <>
      <li>
        <Button
        onClick={() => 
          {const element = document.getElementById("about")
          element.scrollIntoView({behavior: "smooth"})
          }}
         variant='ghost'>About Me</Button>
      </li>
      
      <li>
        <Button
        onClick={() => 
          {const element = document.getElementById("skills")
          element.scrollIntoView({behavior: "smooth"})
          }}
         variant='ghost'>Skills</Button>
      </li>
      <li>
        <Button
        onClick={() => 
          {const element = document.getElementById("projects")
          element.scrollIntoView({behavior: "smooth"})
          }}
         variant='ghost'>Projects</Button>
      </li>
    </>
  );

  return (
    <div className="navbar py-0 px-4 w-[80%] lg:w-[65%] mx-auto border-2 bg-purple-50/60 backdrop-blur-2xl border-purple-300 rounded-full mt-4 sticky top-2 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-white rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {links}
          </ul>
        </div>
        <img src={logo} className="w-10 rounded-full" alt="" />
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 flex gap-1">{links}</ul>
      </div>
      <div className="navbar-end">
        <Button
        onClick={() => 
          {const element = document.getElementById("contact")
          element.scrollIntoView({behavior: "smooth"})
          }}
         className="rounded-full bg-purple-500 border-2 border-purple-200 hover:bg-purple-600">Contact Me</Button>
      </div>
    </div>
  );
};
export default Navbar;
