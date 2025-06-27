import React from "react";

const Contact = () => {
  return (
    <section className="font-main w-full px-4 py-12 text-gray-800" id="contact">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl md:text-5xl font-bold text-center text-gray-950 mb-6">Contact Me</h2>

        {/* Contact Info */}
        <div className="flex flex-col md:flex-row justify-between bg-white shadow-md rounded-2xl p-6 md:p-10 mb-10 gap-6">
          <div className="space-y-4">
            <p className="text-lg">
              <span className="font-semibold text-orange-500">Email:</span> mahi.labib5@@gmail.com
            </p>
            <p className="text-lg">
              <span className="font-semibold text-orange-500">Phone:</span> +880 1675381031
            </p>
            <p className="text-lg">
              <span className="font-semibold text-orange-500">WhatsApp:</span> +880 1675381031
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <form className="bg-white shadow-md rounded-2xl p-6 md:p-10 space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <input
              type="text"
              placeholder="Your Name"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700"
              required
            />
          </div>
          <textarea
            rows="5"
            placeholder="Your Message"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700"
            required
          ></textarea>
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
