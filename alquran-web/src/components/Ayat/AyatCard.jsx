import Number from "../Number";

function AyatCard({ ayat, setTampil, setNomorTafsir }) {
  const handleTafsirClick = () => {
    setNomorTafsir(ayat.nomorAyat - 1);
    setTampil(true);
  };

  return (
    <div className="bg-dark p-4 rounded-lg text-light text-left flex flex-col gap-4 hover:shadow-lg transition">
      <div className="flex justify-between gap-4">
        <Number nomor={ayat.nomorAyat} />
        <p className="font-bold text-2xl text-right w-full arabic-text">
          {ayat.teksArab}
        </p>
      </div>
      <p className="font-sm text-light">{ayat.teksLatin}</p>
      <p className="font-sm text-subtle">{ayat.teksIndonesia}</p>
      <div className="flex gap-4">
        <button
          onClick={handleTafsirClick}
          className="flex items-center gap-3 border border-subtle px-4 py-2 rounded-full hover:scale-105 transition duration-200 text-sm text-text bg-secondary hover:bg-accent-light-purple"
        >
          <svg
            className="w-5 h-5 text-primary"
            viewBox="0 0 384 512"
            fill="currentColor"
          >
            <path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128z" />
          </svg>
          <span className="font-medium">Tafsir</span>
        </button>
      </div>
    </div>
  );
}

export default AyatCard;
