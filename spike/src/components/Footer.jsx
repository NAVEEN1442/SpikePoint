import React from 'react';
import logo from '../assets/logo.jpg';
import { IoMailSharp } from 'react-icons/io5';
import { FaPhone, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

function Footer() {
  return (
    <div className="w-full px-4 max-w-8xl mx-auto">
      <div className="bg-[#111111]/90 backdrop-blur-lg rounded-2xl px-4 sm:px-6 md:px-8 py-6 border-[#956AFA]/20 border-t  shadow-xl transition-all duration-300 hover:shadow-[#956AFA]/30">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 text-[#E0E0E0]">

          {/* Left: Logo & Contact Info */}
          <div className="flex flex-col items-center md:items-start w-full md:w-1/4">
            <img className="h-[80px] w-[80px] mb-2" src={logo} alt="Logo" />
            <div className="text-sm flex flex-col gap-1 text-gray-400 text-center md:text-left">
              <p className="flex items-center gap-2 justify-center md:justify-start">
                <IoMailSharp className="text-[#956AFA]" /> mail@gmail.com
              </p>
              <p className="flex items-center gap-2 justify-center md:justify-start">
                <FaPhone className="text-[#956AFA]" /> +91-9879879879
              </p>
            </div>
          </div>

          {/* Center: Links */}
          <div className="flex flex-col sm:flex-row justify-between w-full md:w-2/4 px-2 text-center sm:text-left gap-6 sm:gap-0">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold mb-2 text-white">About Us</h3>
              <p className="text-sm text-gray-400 hover:text-[#956AFA] transition cursor-pointer">Terms And Conditions</p>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold mb-2 text-white">Contact Us</h3>
              <p className="text-sm text-gray-400 hover:text-[#956AFA] transition cursor-pointer">Mail Id</p>
              <p className="text-sm text-gray-400 hover:text-[#956AFA] transition cursor-pointer">Contact Form</p>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold mb-2 text-white">Explore</h3>
              <p className="text-sm text-gray-400 hover:text-[#956AFA] transition cursor-pointer">Tournaments</p>
              <p className="text-sm text-gray-400 hover:text-[#956AFA] transition cursor-pointer">Leadership Board</p>
              <p className="text-sm text-gray-400 hover:text-[#956AFA] transition cursor-pointer">Buddy Finding</p>
              <p className="text-sm text-gray-400 hover:text-[#956AFA] transition cursor-pointer">Marketplace</p>
            </div>
          </div>

          {/* Right: Social Icons */}
          <div className="flex justify-center md:justify-end items-center gap-5 w-full md:w-1/4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FaInstagram className="text-gray-400 hover:text-[#956AFA] text-[28px] transition" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <FaLinkedin className="text-gray-400 hover:text-[#956AFA] text-[28px] transition" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              <FaYoutube className="text-gray-400 hover:text-[#956AFA] text-[28px] transition" />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Footer;
