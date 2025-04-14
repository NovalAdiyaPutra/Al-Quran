import DetailSurahInfo from "./DetailSurahInfo";
import AudioControl from "../AudioControl";
import AyatList from "../Ayat/AyatList";
import CardTafsir from "./CardTafsir";

function DetailSurah({
  surah,
  tafsir,
  tampil,
  setTampil,
  nomorTafsir,
  setNomorTafsir,
  currentReciter,
  changeReciter,
  onPlay,
  onPause,
  audioPlaying,
}) {
  return (
    <div className="py-8 px-5 flex flex-col gap-5">
      <DetailSurahInfo surah={surah} />

      <AudioControl
        currentReciter={currentReciter}
        changeReciter={changeReciter}
        onPlay={onPlay}
        onPause={onPause}
        audioPlaying={audioPlaying}
      />

      <AyatList
        ayat={surah.ayat}
        item={surah}
        setTampil={setTampil}
        setNomorTafsir={setNomorTafsir}
      />

      <CardTafsir
        item={surah}
        setTampil={setTampil}
        tafsir={tafsir}
        tampil={tampil}
        nomor={nomorTafsir + 1}
      />
    </div>
  );
}

export default DetailSurah;
