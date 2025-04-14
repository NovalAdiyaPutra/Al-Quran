import { useState, useEffect } from "react";
import SurahList from "./SurahList";
import React from "react";

function SurahContainer() {
  const [surahs, setSurahs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch("https://equran.id/api/v2/surat");
        if (!response.ok) {
          throw new Error("Failed to fetch surahs");
        }
        const data = await response.json();
        setSurahs(data.data);
      } catch (error) {
        console.error("Failed to fetch surahs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  // FILTER berdasarkan namaLatin atau arti
  const filteredSurat = surahs.filter(
    (s) =>
      s.namaLatin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.arti.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <p className="text-center mt-6">Loading...</p>;
  }

  return (
    <div className="px-5 py-6">
      <input
        type="text"
        placeholder="Cari surah berdasarkan nama atau arti..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-0 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <SurahList surahs={filteredSurat} />
    </div>
  );
}

export default SurahContainer;
