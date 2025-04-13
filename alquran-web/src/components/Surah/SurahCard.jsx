import { Link } from "react-router-dom";
import Number from "../Number";

function SurahCard({ surah }) {
  return (
    <Link to={`/surah/${surah.nomor}`}>
      <div className="bg-dark p-4 rounded-lg flex justify-between">
        <div className="flex gap-3 text-left">
          <Number nomor={surah.nomor} />
          <div className="flex flex-col gap-2">
            <p className="text-light font-bold text-base">{surah.namaLatin}</p>
            <div>
              <p className="text-subtle text-sm">{surah.arti}</p>
              <p className="text-subtle text-sm">{surah.tempatTurun}</p>
            </div>
          </div>
        </div>

        <p className="text-primary text-2xl font-bold arabic-text">
          {surah.nama}
        </p>
      </div>
    </Link>
  );
}

export default SurahCard;
