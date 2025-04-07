import DetailSurahInfo from "./DetailSurahInfo";
import AudioControl from "../AudioControl";
import AyatList from "../Ayat/AyatList";

function DetailSurah({
  surah,
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

      <AyatList ayat={surah.ayat} />
    </div>
  );
}

export default DetailSurah;
