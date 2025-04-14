import { useEffect } from "react";

function CardTafsir({ item, setTampil, tafsir, tampil, nomor }) {
  useEffect(() => {
    if (tampil) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [tampil]);

  if (!tampil) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-subtle text-light rounded-2xl p-6 w-[90%] max-w-3xl shadow-xl relative animate-fade-in">
        <header className="flex justify-between items-center border-b border-subtle pb-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-dark">
              Tafsir Surat {item.namaLatin}
            </h2>
            <p className="text-lg text-primary">Ayat {nomor}</p>
          </div>
          <button
            onClick={() => setTampil(false)}
            className="text-subtle hover:text-accent transition-transform transform hover:scale-125"
            aria-label="Close"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 384 512">
              <path d="M216 256l93.9-93.9c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L171 210.7 77.1 116.8c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L125.3 256 31.4 349.9c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L171 301.3l93.9 93.9c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L216 256z" />
            </svg>
          </button>
        </header>

        <div className="space-y-6 overflow-y-auto max-h-[65vh] pr-2">
          <p className="text-3xl text-right arabic-text leading-loose text-dark">
            {item.ayat[nomor - 1].teksArab}
          </p>
          <p className="text-base leading-relaxed text-justify text-dark">
            {tafsir?.teks || "Tafsir tidak tersedia untuk ayat ini."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CardTafsir;
