function Verse({ verse, surah }) {
  return (
    <div
      className="bg-[url('/src/assets/VerseBackgroundImage.png')] 
    p-4 rounded-2xl bg-cover bg-no-repeat min-h-[150px] text-left flex flex-col justify-between gap-2"
    >
      <div>
        <p className="text-xs text-light md:text-base">Your Daily Verse</p>
        <p className="text-sm text-light font-semibold md:text-xl">{verse}</p>
      </div>
      <p className="text-xs text-light font-light md:text-sm">{surah}</p>
    </div>
  );
}

export default Verse;
