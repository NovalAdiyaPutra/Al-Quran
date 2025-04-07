import AyatCard from "./AyatCard";

function AyatList({ ayat }) {
  return (
    <div className="flex flex-col gap-3">
      {ayat.map((item) => (
        <AyatCard key={item.nomorAyat} ayat={item} />
      ))}
    </div>
  );
}

export default AyatList;
