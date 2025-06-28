import React from "react";
import { MdEmail, MdPhone, MdWhatsapp } from "react-icons/md";
import { useForm, ValidationError } from "@formspree/react";

const Contact = () => {
  const [state, handleSubmit] = useForm("xqabwgvo");

  if (state.succeeded) {
    alert("Thanks for your submission!");
  }

  return (
    <section
      className="font-main w-full max-w-4xl mx-auto px-4 py-12 text-gray-800"
      id="contact"
    >
      <div className="flex flex-col gap-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-950">
          Contact Me
        </h2>

        {/* Contact Info */}
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-center lg:gap-6">
          {/* Email */}
          <div className="flex-1 flex items-center gap-3 border-2 border-purple-100 p-4 rounded-2xl">
            <MdEmail size={24} className="text-purple-500" />
            <a
              href="mailto:mahi.labib5@gmail.com"
              className="text-blue-600 hover:underline text-sm sm:text-base"
            >
              mahi.labib5@gmail.com
            </a>
          </div>

          {/* Phone */}
          <div className="flex-1 flex items-center gap-3 border-2 border-purple-100 p-4 rounded-2xl">
            <MdPhone size={24} className="text-purple-500" />
            <a
              href="tel:+8801675381031"
              className="text-blue-600 hover:underline text-sm sm:text-base"
            >
              +880 1675381031
            </a>
          </div>

          {/* WhatsApp */}
          <div className="flex-1 flex items-center gap-3 border-2 border-purple-100 p-4 rounded-2xl">
            <MdWhatsapp size={24} className="text-purple-500" />
            <a
              href="https://wa.me/8801675381031"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm sm:text-base"
            >
              +880 1675381031
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full max-w-xl mx-auto"
        >
          <input
            type="text"
            placeholder="Your Name"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700"
            required
          />
          <input
            id="email"
            placeholder="Your email address"
            type="email"
            name="email"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700"
          />
          <ValidationError prefix="Email" field="email" errors={state.errors} />

          <textarea
            id="message"
            name="message"
            placeholder="Your Message"
            rows={5}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700"
          />
          <ValidationError
            prefix="Message"
            field="message"
            errors={state.errors}
          />

          <button
            type="submit"
            disabled={state.submitting}
            className="w-full md:w-auto px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
