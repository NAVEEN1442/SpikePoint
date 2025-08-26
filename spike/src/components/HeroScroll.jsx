import { useEffect, useRef } from "react";
import { useScroll, motion } from "framer-motion";
import heroVideo from "../assets/mainVideo.mp4"; // convert your gif to mp4

export default function HeroScrollVideo() {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });

  // Map scroll progress [0,1] → video duration
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      if (videoRef.current) {
        const duration = videoRef.current.duration;
        videoRef.current.currentTime = v * duration;
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div ref={ref} className="h-[200vh] flex items-center justify-center bg-black">
      <motion.video
        ref={videoRef}
        src={heroVideo}
        className="w-[700px] rounded-2xl shadow-[0_0_50px_#956AFA]"
        playsInline
        muted
      />
    </div>
  );
}
