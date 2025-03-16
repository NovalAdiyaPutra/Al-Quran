import React, { useState, useEffect } from "react";
import { Search, Eye, BookOpen, Loader2, CircleChevronLeft, Play, Pause, X, LightbulbOff, Lightbulb, BookOpenText } from "lucide-react";

const QuranFinder = () => {
  const [surahs, setSurahs] = useState([]);
  const [filteredSurahs, setFilteredSurahs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [surahDetail, setSurahDetail] = useState(null);
  const [showVerses, setShowVerses] = useState(false);
  const [playing, setPlaying] = useState(null);
  const [audioRef, setAudioRef] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [playingVerse, setPlayingVerse] = useState(null);
  const [activeQari, setActiveQari] = useState("01");
  const [darkMode, setDarkMode] = useState(false);
  const [BookOpenMarks, setBookOpenMarks] = useState([]);

  // Skema warna berdasarkan mode gelap
  const colors = darkMode
    ? {
        primary: "bg-blue-900",
        primaryHover: "bg-blue-800",
        primaryText: "text-blue-400",
        secondary: "bg-grey-1000",
        secondaryHover: "bg-blue-1000",
        bg: "bg-gray-800",
        cardBg: "bg-grey-600",
        textPrimary: "text-gray-100",
        textSecondary: "text-yellow-300",
        textTertiary: "text-yellow-600",
        border: "border-yellow-200",
        highlight: "bg-blue-950",
        arabic: "text-yellow-300",
      }
    : {
        primary: "bg-blue-700",
        primaryHover: "bg-blue-800",
        primaryText: "text-blue-700",
        secondary: "bg-gray-200",
        secondaryHover: "bg-gray-300",
        bg: "bg-blue-100",
        cardBg: "bg-white",
        textPrimary: "text-gray-900",
        textSecondary: "text-grey-400",
        textTertiary: "text-grey-600",
        border: "border-gray-300",
        highlight: "bg-blue-100",
        arabic: "text-blue-900",
      };
    
  // State untuk Hijriah & Jadwal Sholat
  const [hijriahDate, setHijriahDate] = useState("");
  const [prayerTimes, setPrayerTimes] = useState(null);

  // Ambil data Hijriah & jadwal sholat
  useEffect(() => {
    const fetchHijriaAndPray = async () => {
      try {
        const hijriaRes = await fetch("https://api.myquran.com/v2/cal/hijr?adj=-1");
        const hijriaData = await hijriaRes.json();

        const date = new Date();
        const getCurDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        const prayRes = await fetch(`https://api.myquran.com/v2/sholat/jadwal/0412/${getCurDate}`);
        const prayData = await prayRes.json();

        if (hijriaData.status && prayData.status) {
          setHijriahDate(hijriaData.data.date[1]);
          setPrayerTimes(prayData.data.jadwal);
        } else {
          throw new Error("Gagal mengambil data Hijriah & jadwal sholat.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchHijriaAndPray();
  }, []);


  // Muat BookOpenText dari localStorage
  useEffect(() => {
    const savedBookOpenMarks = localStorage.getItem("quranBookOpenMarks");
    if (savedBookOpenMarks) {
      setBookOpenMarks(JSON.parse(savedBookOpenMarks));
    }

    // Periksa preferensi tema yang disimpan
    const savedTheme = localStorage.getItem("quranTheme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  // Simpan BookOpenMarks ke localStorage
  useEffect(() => {
    localStorage.setItem("quranBookOpenMarks", JSON.stringify(BookOpenMarks));
  }, [BookOpenMarks]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem("quranTheme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Fetch data from API
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://equran.id/api/v2/surat");
        const data = await response.json();

        if (data.code === 200 && data.data) {
          setSurahs(data.data);
          setFilteredSurahs(data.data);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (err) {
        setError("Terjadi kesalahan. Silakan coba lagi nanti.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSurahs(surahs);
    } else {
      const filtered = surahs.filter((surah) => surah.namaLatin.toLowerCase().includes(searchTerm.toLowerCase()) || surah.arti.toLowerCase().includes(searchTerm.toLowerCase()) || surah.nomor.toString().includes(searchTerm));
      setFilteredSurahs(filtered);
    }
  }, [searchTerm, surahs]);

  // Stop any playing audio when unmounted
  useEffect(() => {
    return () => {
      if (audioRef) {
        audioRef.pause();
      }
    };
  }, []);

  // Fetch surah detail with ayat
  const fetchSurahDetail = async (nomor) => {
    try {
      setLoadingDetail(true);
      const response = await fetch(`https://equran.id/api/v2/surat/${nomor}`);
      const data = await response.json();

      if (data.code === 200 && data.data) {
        setSurahDetail(data.data);
      } else {
        throw new Error("Tidak dapat mengambil data surah");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi nanti.");
      console.error(err);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Handle audio play for full surah
  const playAudio = (surahId, audioVersion) => {
    if (audioRef) {
      audioRef.pause();
    }

    const surah = surahs.find((s) => s.nomor === surahId);
    if (surah && surah.audioFull) {
      const audio = new Audio(surah.audioFull[audioVersion]);
      audio.play();
      setAudioRef(audio);
      setPlaying({ surahId, audioVersion });

      audio.onended = () => {
        setPlaying(null);
      };
    }
  };

  // Handle audio play for specific verse
  const playVerseAudio = (nomorAyat, audioUrl) => {
    if (audioRef) {
      audioRef.pause();
    }

    const audio = new Audio(audioUrl);
    audio.play();
    setAudioRef(audio);
    setPlayingVerse(nomorAyat);

    audio.onended = () => {
      setPlayingVerse(null);
    };
  };

  // Stop audio
  const stopAudio = () => {
    if (audioRef) {
      audioRef.pause();
      setPlaying(null);
      setPlayingVerse(null);
    }
  };

  // Handle surah selection
  const handleSelectSurah = (surah) => {
    setSelectedSurah(surah);
    fetchSurahDetail(surah.nomor);
  };

  // Handle back to list
  const handleBackToList = () => {
    stopAudio();
    setSelectedSurah(null);
    setSurahDetail(null);
    setShowVerses(false);
  };

  // Handle back to surah detail
  const handleBackToSurahDetail = () => {
    stopAudio();
    setShowVerses(false);
  };

  // Handle showing verses
  const handleShowVerses = () => {
    setShowVerses(true);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Toggle BookOpenText
  const toggleBookOpenMark = (verseId) => {
    const surahId = selectedSurah.nomor;
    const BookOpenMarkId = `${surahId}-${verseId}`;

    if (BookOpenMarks.includes(BookOpenMarkId)) {
      setBookOpenMarks(BookOpenMarks.filter((id) => id !== BookOpenMarkId));
    } else {
      setBookOpenMarks([...BookOpenMarks, BookOpenMarkId]);
    }
  };

  // Check if verse is BookOpenMarked
  const isBookOpenMarked = (verseId) => {
    const surahId = selectedSurah.nomor;
    return BookOpenMarks.includes(`${surahId}-${verseId}`);
  };

  // Format nomor ayat to include leading zeros
  const formatAyatNumber = (number, totalAyat) => {
    const length = totalAyat.toString().length;
    return number.toString().padStart(length, "0");
  };

  // Getting qari name from version
  const getQariName = (version) => {
    const qariNames = {
      "01": "Abdullah Al-Juhany",
      "02": "Abdul Muhsin Al-Qasim",
      "03": "Abdurrahman as-Sudais",
      "04": "Ibrahim Al-Dossari",
      "05": "Misyari Rasyid Al-Afasi",
    };

    return qariNames[version] || `Qari ${version}`;
  };

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center h-screen ${colors.bg}`}>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-amber-500 blur-lg opacity-20 rounded-full"></div>
          <Loader2 className="h-16 w-16 text-emerald-600 animate-spin mb-4 relative z-10" />
        </div>
        <p className={`${colors.textSecondary} mt-6 text-lg`}>Memuat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center h-screen ${colors.bg}`}>
        <div className="bg-red-100 p-6 rounded-lg text-red-800 max-w-md shadow-lg border border-red-200">
          <p className="font-medium text-center">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  // Main app rendering
  return (
    <div className={`min-h-screen ${colors.bg} transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto p-4">
        {/* Header with dark mode toggle */}
        <div className="flex justify-between items-center mb-6">
          <div></div> {/* Spacer */}
          <button onClick={toggleDarkMode} className={`p-3 rounded-full ${darkMode ? "bg-gray-700 text-amber-300" : "bg-amber-100 text-amber-800"}`}>
            {darkMode ? <LightbulbOff className="h-5 w-5" /> : <Lightbulb className="h-5 w-5" />}
          </button>
        </div>

        {/* List of Surahs */}
        {!selectedSurah ? (
          <>
          <div className="mb-10 text-center">
              <div className="inline-block relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-amber-500 blur-lg opacity-20 rounded-full"></div>
                <div className={`relative z-10 ${colors.textPrimary} font-arabic text-5xl mb-2`}>Al-Quran Digital</div>
                <h1 className={`text-4xl font-bold ${colors.primaryText} mb-2`}>----------------------------</h1>
                <p className={`${colors.textSecondary} text-lg mt-2 max-w-xl mx-auto`}>|Noval Adiya Putra|</p>
              </div>
            </div>

            <div className={`p-4 mb-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
              {/* Bagian Hijriah dan Jadwal Sholat */}
              <div className="mb-4 flex flex-col items-center">
                <div className="p-3 rounded-lg shadow text-center text-antique-blue font-merriweather text-xl font-semibold underline max-w-52">
                  Waktu Sholat
                </div>
                {hijriahDate && prayerTimes ? (
                  <marquee className="text-lg font-semibold max-w-xl">
                    📅 {hijriahDate} - ☀ Subuh: {prayerTimes.subuh} WIB - 🌤 Dhuha: {prayerTimes.dhuha} WIB - ⛅ Dzuhur: {prayerTimes.dzuhur} WIB - 🌓 Ashar: {prayerTimes.ashar} WIB - 🌒 Maghrib: {prayerTimes.maghrib} WIB - 🌚 Isya: {prayerTimes.isya} WIB
                  </marquee>
                ) : (
                  <p>Fetching Hijriah & Prayer Times...</p>
                )}
              </div>
            </div>

            <div className="w-4/12 overflow-y-auto flex flex-col gap-3 pr-3 pb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari surat .."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full py-4 pl-12 pr-4 ${colors.cardBg} rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 border ${colors.border} ${colors.textPrimary}`}
                />
                <Search className={`absolute left-4 top-4 ${colors.textTertiary} h-5 w-5`} />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className={`absolute right-4 top-4 ${colors.textTertiary} hover:${colors.textPrimary}`}>
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              {filteredSurahs.map((surah) => (
                <div
                  key={surah.nomor}
                  className={`${colors.cardBg} rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border ${colors.border}`}
                  onClick={() => handleSelectSurah(surah)}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center ${colors.primary} ${colors.secondary} font-medium`}>{surah.nomor}</div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className={`font-medium text-lg ${colors.textPrimary}`}>{surah.namaLatin}</h3>
                          <p className={`text-sm ${colors.textSecondary}`}>{surah.arti}</p>
                        </div>
                        <div className={`text-right font-arabic text-2xl ${colors.arabic}`}>{surah.nama}</div>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className={`text-xs ${colors.textTertiary} px-2 py-1 ${colors.secondary} rounded-full`}>
                          {surah.tempatTurun} • {surah.jumlahAyat} Ayat
                        </span>
                        <Eye className={`h-5 w-5 ${colors.textTertiary}`} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredSurahs.length === 0 && (
              <div className={`text-center py-16 ${colors.cardBg} rounded-xl shadow-md my-8`}>
                <p className={`${colors.textSecondary} text-lg`}>Tidak ada surat yang sesuai dengan pencarian Anda.</p>
                <button onClick={() => setSearchTerm("")} className={`mt-4 px-6 py-2 ${colors.primary} text-white rounded-lg hover:${colors.primaryHover}`}>
                  Reset Pencarian
                </button>
              </div>
            )}
          </>
        ) : showVerses ? (
          /* Ayat Page */
          <div className={`${colors.cardBg} rounded-xl shadow-lg mb-8 border ${colors.border} overflow-hidden`}>
            {loadingDetail ? (
              <div className="flex flex-col items-center justify-center p-12">
                <Loader2 className={`h-10 w-10 ${colors.primaryText} animate-spin mb-4`} />
                <p className={colors.textSecondary}>Memuat ayat-ayat...</p>
              </div>
            ) : surahDetail ? (
              <>
                <div className={`sticky top-0 z-10 ${colors.cardBg} border-b ${colors.border} p-4 rounded-t-xl`}>
                  <div className="flex justify-between items-center">
                    <button onClick={handleBackToSurahDetail} className={`${colors.primaryText} flex items-center text-sm font-medium px-3 py-1 ${colors.secondary} rounded-lg`}>
                      <CircleChevronLeft className="h-4 w-4 mr-1" />
                      Kembali
                    </button>
                    <h2 className={`text-xl font-bold ${colors.primaryText}`}>{surahDetail.namaLatin}</h2>
                  </div>

                  {/* Qari selection */}
                  <div className="mt-4 flex items-center justify-center">
                    <div className={`flex flex-wrap justify-center gap-2 p-2 ${colors.secondary} rounded-xl`}>
                      {Object.keys(surahDetail.audioFull).map((version) => (
                        <button
                          key={version}
                          onClick={() => setActiveQari(version)}
                          className={`px-4 py-2 text-sm rounded-lg transition-all ${activeQari === version ? `${colors.primary} text-white shadow-md` : `bg-opacity-50 ${colors.textSecondary} hover:${colors.secondaryHover}`}`}
                        >
                          {getQariName(version).split(" ")[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {surahDetail.ayat.map((ayat) => (
                    <div key={ayat.nomorAyat} className={`mb-10 pb-8 border-b ${colors.border} last:border-0`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-10 h-10 flex-shrink-0 ${colors.secondary} rounded-full flex items-center justify-center ${colors.primaryText} text-sm font-medium`}>{formatAyatNumber(ayat.nomorAyat, surahDetail.jumlahAyat)}</div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleBookOpenMark(ayat.nomorAyat)} className={`p-2 rounded-full ${isBookOpenMarked(ayat.nomorAyat) ? "bg-amber-100 text-amber-600" : `${colors.secondary} ${colors.textSecondary}`}`}>
                            <BookOpenText className={`h-4 w-4 ${isBookOpenMarked(ayat.nomorAyat) ? "fill-amber-600" : ""}`} />
                          </button>
                          <button
                            onClick={() => (playingVerse === ayat.nomorAyat ? stopAudio() : playVerseAudio(ayat.nomorAyat, ayat.audio[activeQari]))}
                            className={`p-2 rounded-full ${playingVerse === ayat.nomorAyat ? `${colors.primary} text-white` : `${colors.secondary} ${colors.textSecondary} hover:${colors.secondaryHover}`}`}
                          >
                            {playingVerse === ayat.nomorAyat ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className={`p-6 rounded-xl ${colors.highlight} mb-4 border ${colors.border}`}>
                        <p className={`text-right font-arabic text-2xl leading-loose ${colors.arabic}`}>{ayat.teksArab}</p>
                        <p className={`text-right text-sm italic mb-3 ${colors.textTertiary}`}>{ayat.teksLatin}</p>
                      </div>
                      <p className={`${colors.textPrimary} leading-relaxed`}>{ayat.teksIndonesia}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <p className={colors.textSecondary}>Tidak dapat memuat detail ayat.</p>
              </div>
            )}
          </div>
        ) : (
          /* Surah Detail Page */
          <div className={`${colors.cardBg} rounded-xl shadow-lg p-6 border ${colors.border}`}>
            <div className="flex justify-between items-center mb-6">
              <button onClick={handleBackToList} className={`${colors.primaryText} flex items-center text-sm font-medium px-3 py-1 ${colors.secondary} rounded-lg`}>
                <CircleChevronLeft className="h-4 w-4 mr-1" />
                Back
              </button>
            </div>

            {loadingDetail ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className={`h-10 w-10 ${colors.primaryText} animate-spin mb-4`} />
                <p className={colors.textSecondary}>Memuat...</p>
              </div>
            ) : surahDetail ? (
              <>
                <div className={`${colors.highlight} rounded-xl p-8 text-center mb-8 border ${colors.border}`}>
                  <p className={`text-3xl font-arabic ${colors.arabic} my-3`}>{surahDetail.nama}</p>
                  <h2 className={`text-3xl font-bold ${colors.primaryText} mb-1`}>{surahDetail.namaLatin}</h2>
                  <div className="flex justify-center mt-4">
                  <div className={`flex items-center justify-center gap-3 py-4 px-6 ${colors.secondary} ${colors.textPrimary} rounded-xl border ${colors.border}`}>
                  <div className="text-center">
                      <div className="font-bold text-lg">{surahDetail.arti}</div>
                      <div className={`${colors.secondary} text-sm`}>Arti</div>
                    </div>
                    <div className="h-8 w-px bg-gray-300 mx-2"></div>
                    <div className="text-center">
                      <div className="font-bold text-2xl">{surahDetail.jumlahAyat}</div>
                      <div className={`${colors.secondary} text-sm`}>Jumlah Ayat</div>
                    </div>
                    <div className="h-8 w-px bg-gray-300 mx-2"></div>
                    <div className="text-center">
                      <div className="font-bold text-lg">{surahDetail.tempatTurun}</div>
                      <div className={`${colors.secondary} text-sm`}>Tempat Turun</div>
                    </div>
                  </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-1 gap-4 mb-8">
                  <button onClick={handleShowVerses} className={`flex items-center justify-center gap-3 py-4 px-6 ${colors.primary} text-white rounded-xl hover:${colors.primaryHover} transition-colors shadow-md`}>
                    <BookOpen className="h-5 w-5" />
                    <span className="font-medium">Baca Surat</span>
                  </button>
                </div>

                <div className={`${colors.secondary} rounded-xl p-6 mb-8 border ${colors.border}`}>
                  <h3 className={`font-medium ${colors.textPrimary} mb-4 text-lg`}>Tentang Surat {surahDetail.namaLatin}</h3>
                  <div className={`prose max-w-none ${colors.textSecondary}`} dangerouslySetInnerHTML={{ __html: surahDetail.deskripsi }} />
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <p className={colors.textSecondary}>Tidak dapat memuat detail surat.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuranFinder;