import React from 'react';
import DoublyButtons from './DoublyButtons';
import heroGIF from '../assets/heroGIF.gif';

function HeroSection() {
  const onPrimaryClick = () => {
    console.log("btn 1");
  };

  const onSecondaryClick = () => {
    console.log("Secondary clicked!");
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-10 flex flex-col gap-10 items-center">
      {/* Heading */}
      <h1 className="text-[32px] sm:text-[40px] md:text-[48px] lg:text-[58px] w-full text-center font-bold text-white leading-tight">
        Join India’s Ultimate Valorant Arena
      </h1>

      {/* Image */}
      <img
        src={heroGIF}
        alt="Valorant Arena"
        className="w-full max-w-[850px] rounded-[11px] mx-auto"
      />

      {/* Description */}
      <p className="text-gray-300 text-[18px] sm:text-[20px] md:text-[24px] lg:text-[28px] w-full max-w-5xl text-center leading-relaxed">
        Compete in skill-based tournaments, earn in-game currency,<br className="hidden sm:block" />
        and convert your victories into real-world rewards.<br className="hidden sm:block" />
        Whether you're a solo warrior or a full-stack squad,<br className="hidden sm:block" />
        this is where your grind gets paid.
      </p>

      {/* Buttons */}
      <DoublyButtons
        primaryText="Start Competing"
        secondaryText="Find Gaming Buddy"
        onPrimaryClick={onPrimaryClick}
        onSecondaryClick={onSecondaryClick}
      />
    </div>
  );
}

export default HeroSection;
