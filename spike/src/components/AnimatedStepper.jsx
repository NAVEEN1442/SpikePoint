
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CheckCircle } from "lucide-react";
import image1 from '../assets/1.webp';
import image2 from '../assets/2.webp';


const steps = [
  {
    title: "Sign up for Free",
    description:
      "Create your account in seconds and step into the community. It’s quick, secure, and sets you on the path to connecting with gamers worldwide.",
    image: image1,
  },
  {
    title: "Join & Explore",
    description:
      "Discover new communities, games, and opportunities. Connect with like-minded people who share your passion.",
    image: image2,
  },
  {
    title: "Play & Make Friends",
    description:
      "Enjoy exciting games with others, and turn your teammates into long-term friends.",
    image: image1,
  },
  {
    title: "Earn & Grow",
    description:
      "Form your dream team, level up your skills, and even earn rewards as you grow together.",
    image: image2,
  },
];

export default function ProgressTimeline() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.2"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
  <div className="w-full flex justify-center py-24 px-6 bg-[#111111]">
    <div ref={ref} className="relative max-w-5xl w-full">
      {/* Static Line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-0 h-full w-[3px] bg-[#956AFA]/20" />

      {/* Animated Line */}
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 top-0 w-[3px] bg-[#956AFA]"
        style={{ height: lineHeight }}
      />

      <div className="space-y-32">
        {steps.map((step, index) => {
          const isLeft = index % 2 === 0;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative flex flex-col md:flex-row items-center ${
                isLeft ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Icon in center */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-1 md:top-1/2 flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#956AFA] bg-[#111111] z-10">
                <CheckCircle className="w-6 h-6 text-[#956AFA]" />
              </div>

              {/* Text Section */}
              <div className="md:w-1/2 px-6 text-center md:text-left">
                <h3 className="text-white text-2xl font-bold">{step.title}</h3>
                <p className="text-gray-300 mt-4 text-base leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Image Section */}
             <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
                <motion.div
                  className="relative rounded-2xl overflow-hidden shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                >
                  <img
                    src={step.image}
                    alt={step.title}
                    className="rounded-2xl w-[380px] h-[240px] object-cover"
                  />

                  
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </div>
);

}
