import AyatCard from "./AyatCard";

function AyatList({ ayat, item, setTampil, setNomorTafsir }) {
  return (
    <div className="flex flex-col gap-3">
      {ayat.map((itemAyat) => (
        <AyatCard
          key={itemAyat.nomorAyat}
          ayat={itemAyat}
          item={item}
          setTampil={setTampil}
          setNomorTafsir={setNomorTafsir}
        />
      ))}
    </div>
  );
}

export default AyatList;
