import React, { useState } from "react";

interface TTSButtonProps {
  text: string;
}

const TTSButton: React.FC<TTSButtonProps> = ({ text }) => {
  const [speaking, setSpeaking] = useState(false);

  const handleSpeak = () => {
    if (!text) return;
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "vi-VN";
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    setSpeaking(true);
    synth.speak(utter);
  };

  return (
    <button
      type="button"
      className={`px-3 py-2 rounded font-bold text-white bg-red-600 hover:bg-red-700 transition ${speaking ? "opacity-60" : ""}`}
      onClick={handleSpeak}
      disabled={speaking}
      aria-label={speaking ? "Đang đọc" : "Đọc bài viết"}
    >
      {speaking ? "Đang đọc..." : "Đọc bài viết"}
    </button>
  );
};

export default TTSButton;
