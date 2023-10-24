import React from "react";
//countup
import CountUp from "react-countup";
//oberver hook
import { useInView } from "react-intersection-observer";
//motion
// import {motion} from 'react-motion';
//variants
import { fadeIn } from "../variants";

const About = () => {
  const [ref, inView] = useInView({
    threshold: 0.5,
  });
  return (
    <section className="section" id="about" ref={ref}>
      <div className="container mx-auto">
       
      </div>
    </section>
  );
};

export default About;
