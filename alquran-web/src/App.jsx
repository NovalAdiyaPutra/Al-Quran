import { Route, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import DetailSurahPage from "./pages/DetailSurahPage";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/surah/:surahId" element={<DetailSurahPage />} />
        <Route path="/about" element={<AboutPage />} /> {/* ⬅️ Route baru */}
      </Routes>
    </div>
  );
}

export default App;
