import React from "react";
import About from "../components/About";
import { useNavigate } from "react-router-dom";

function AboutPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen px-6 py-10"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-light)",
      }}
    >
      <div
        className="max-w-2xl mx-auto p-8 rounded-2xl shadow-lg"
        style={{
          backgroundColor: "var(--color-light)",
          color: "var(--color-text)",
        }}
      >
        <h1
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: "var(--color-primary)" }}
        >
          Tentang Saya
        </h1>

        <About />

        {/* Tombol kembali ke homepage di tengah */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="font-semibold px-6 py-2 rounded-full transition shadow-md hover:scale-105"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-text)",
            }}
          >
            ⬅ Kembali ke Homepage
          </button>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
