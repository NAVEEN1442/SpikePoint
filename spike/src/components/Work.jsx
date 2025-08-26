import React from "react";
import DoublyButtons from "./DoublyButtons";
import { motion } from "framer-motion";
import AnimatedStepper from "./AnimatedStepper";

function Work() {
  return (
    <div className="w-full flex flex-col gap-12 items-center py-24 bg-[#111111] text-white">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-[42px] sm:text-[58px] font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-[#956AFA]"
      >
        How It Works
      </motion.h1>

        <AnimatedStepper/>

      <motion.p
        className="text-[20px] md:text-[28px] text-[#E0E0E0] text-center max-w-3xl leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        Join thousands of Indian Valorant players<br />
        and turn every match into a mission for<br />
        glory and rewards
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <DoublyButtons
          primaryText="Join A Tournament"
          onPrimaryClick={() => console.log("Work section button clicked!")}
          primaryColor="#956AFA"
          secondaryColor="#FFFFFF"
        />
      </motion.div>
    </div>
  );
}

export default Work;
