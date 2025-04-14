import SurahContainer from "../components/Surah/SurahContainer";
import Hero from "../components/Hero";
import React from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon } from "@heroicons/react/24/solid"; // Import ikon user

function Homepage() {
  const navigate = useNavigate();

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Navigates the user to the About page when called.
   */

  /*******  8ba7b62e-c5b9-4cab-aa6f-efdc5aad091c  *******/
  const handleAboutClick = () => {
    navigate("/about");
  };

  return (
    <div className="text-white px-4">
      <Hero />

      {/* Tombol untuk ke halaman About */}
      <div className="my-6 text-center">
        <button
          onClick={handleAboutClick}
          className="bg-purple-600 hover:bg-purple-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition duration-300 transform hover:scale-105"
        >
          <UserIcon className="h-5 w-5 text-white" />
          Lihat Biodata Saya
        </button>
      </div>

      <SurahContainer />
    </div>
  );
}

export default Homepage;
