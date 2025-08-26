import React from "react";
import { motion } from "framer-motion";
import DoublyButtons from "./DoublyButtons";
import heroGIF from "../assets/heroGIF.gif";

function HeroSection() {
  return (
    <div 
      className="w-full px-4 sm:px-6 lg:px-10 py-20 flex flex-col gap-12 items-center text-white"
      style={{ backgroundColor: "#111111" }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-[32px] sm:text-[40px] md:text-[48px] lg:text-[58px] font-extrabold text-center leading-tight bg-clip-text text-transparent"
        style={{ 
          backgroundImage: `linear-gradient(to right, white, #956AFA)`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text"
        }}
      >
        Join India's Ultimate Valorant Arena
      </motion.h1>

      <motion.img
        src={heroGIF}
        alt="Valorant Arena"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="w-full max-w-[850px] rounded-xl shadow-2xl"
        style={{ 
          border: `2px solid #956AFA`,
          boxShadow: `0 25px 50px -12px rgba(149, 106, 250, 0.3)`
        }}
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-[18px] sm:text-[20px] md:text-[24px] lg:text-[28px] text-center max-w-5xl leading-relaxed"
        style={{ color: "white" }}
      >
        Compete in skill-based tournaments, earn in-game currency,
        <br className="hidden sm:block" />
        and convert your victories into real-world rewards.
        <br className="hidden sm:block" />
        Whether you're a solo warrior or a full-stack squad,
        <br className="hidden sm:block" />
        <span style={{ color: "#956AFA" }}>this is where your grind gets paid.</span>
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <DoublyButtons
          primaryText="Start Competing"
          secondaryText="Find Gaming Buddy"
          onPrimaryClick={() => console.log("Start Competing")}
          onSecondaryClick={() => console.log("Find Gaming Buddy")}
        />
      </motion.div>
    </div>
  );
}

export default HeroSection;