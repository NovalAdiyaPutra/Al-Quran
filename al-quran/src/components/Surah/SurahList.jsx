import React from "react";
import SurahCard from "./SurahCard";

function SurahList({ surahs }) {
  return (
    <div className="flex flex-col gap-4 py-6 px-5">
      {surahs.map((surah) => (
        <SurahCard key={surah.nomor} surah={surah} />
      ))}
    </div>
  );
}

export default SurahList;
