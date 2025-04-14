import SurahContainer from "../components/Surah/SurahContainer";
import Hero from "../components/Hero";
import React from "react";

function Homepage() {
  return (
    <div className="text-white">
      <Hero />
      <SurahContainer />
    </div>
  );
}

export default Homepage;
