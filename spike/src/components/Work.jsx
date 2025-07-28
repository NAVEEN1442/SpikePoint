import React from 'react';
import steps from "../assets/steps.png";
import DoublyButtons from './DoublyButtons';

function Work() {
  return (
    <div className="flex flex-col gap-[50px] items-center w-full  text-white py-16">
      <h1 className="text-center text-[58px] font-bold">How It Works</h1>

      <img className="w-[800px] h-[500px]" src={steps} alt="How It Works" />

      <p className="text-[28px] text-center text-gray-300 leading-relaxed">
        Join thousands of Indian Valorant players<br />
        and turn every match into a mission for<br />
        glory and rewards
      </p>

      <DoublyButtons
        primaryText="Join A Tournament"
        onPrimaryClick={() => console.log("Work section button clicked!")}
      />
    </div>
  );
}

export default Work;
