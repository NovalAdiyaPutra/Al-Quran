import { useState, useEffect } from "react";
import SurahList from "./SurahList";
import React from "react";

function SurahContainer() {
  const [surahs, setSurahs] = useState([]);
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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return <SurahList surahs={surahs} />;
}

export default SurahContainer;
