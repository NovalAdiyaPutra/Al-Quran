import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import DetailSurah from "./DetailSurah";

function DetailSurahContainer() {
  const { surahId } = useParams();
  const [surah, setSurah] = useState(null);
  const [tafsirList, setTafsirList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nomorTafsir, setNomorTafsir] = useState(0);
  const [tampil, setTampil] = useState(false);
  const [currentReciter, setCurrentReciter] = useState("01");
  const [audioPlaying, setAudioPlaying] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    const fetchSurah = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://equran.id/api/v2/surat/${surahId}`
        );
        if (!response.ok) throw new Error("Failed to fetch surah data");
        const data = await response.json();
        setSurah(data.data);
      } catch (err) {
        setError(err?.message || "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchSurah();
  }, [surahId]);

  useEffect(() => {
    if (surah) {
      fetch(`https://equran.id/api/v2/tafsir/${surahId}`)
        .then((res) => res.json())
        .then(({ data }) => setTafsirList(data.tafsir));
    }
  }, [surah, surahId]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const changeReciter = (reciterId) => {
    setCurrentReciter(reciterId);
    if (audioPlaying) {
      handlePauseAudio();
      setTimeout(handlePlayFullSurah, 100);
    }
  };

  const handlePlayFullSurah = () => {
    if (!surah) return;
    if (audioRef.current) audioRef.current.pause();

    audioRef.current = new Audio(surah.audioFull[currentReciter]);
    audioRef.current.onended = () => setAudioPlaying(false);
    audioRef.current.play();
    setAudioPlaying(true);
  };

  const handlePauseAudio = () => {
    if (audioRef.current) audioRef.current.pause();
    setAudioPlaying(false);
  };

  if (loading) return <div className="p-5 text-center">Memuat...</div>;
  if (error || !surah)
    return (
      <div className="p-5 text-center text-red-500">
        Error: {error || "Surah tidak ditemukan"}
      </div>
    );

  return (
    <DetailSurah
      surah={surah}
      tafsir={tafsirList[nomorTafsir]}
      tampil={tampil}
      setTampil={setTampil}
      nomorTafsir={nomorTafsir}
      setNomorTafsir={setNomorTafsir}
      currentReciter={currentReciter}
      changeReciter={changeReciter}
      onPlay={handlePlayFullSurah}
      onPause={handlePauseAudio}
      audioPlaying={audioPlaying}
    />
  );
}

export default DetailSurahContainer;
