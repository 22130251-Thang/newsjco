import React, { useState, useEffect } from "react";

interface TTSButtonProps {
  text: string;
}

const TTSButton: React.FC<TTSButtonProps> = ({ text }) => {
  const [speaking, setSpeaking] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const cleanText = (html: string) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  const handleSpeak = () => {
    if (!text) return;
    
    const synth = window.speechSynthesis;
    
    if (synth.speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }

    const cleanedText = cleanText(text);
    const textToSpeak = cleanedText.slice(0, 5000);

    const utter = new SpeechSynthesisUtterance(textToSpeak);
    utter.lang = "vi-VN";
    
    const voices = synth.getVoices();
    const viVoice = voices.find(v => 
      v.lang === "vi-VN" || 
      v.lang === "vi_VN" || 
      v.lang.startsWith("vi")
    );
    
    if (viVoice) {
      utter.voice = viVoice;
    }

    utter.rate = 1.0;
    utter.pitch = 1.0;
    utter.volume = 1.0;

    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);

    synth.speak(utter);
  };

  return (
    <button
      type="button"
      className={`px-3 py-2 rounded font-bold text-white bg-red-600 hover:bg-red-700 transition ${
        speaking ? "opacity-60 cursor-not-allowed" : ""
      }`}
      onClick={handleSpeak}
      disabled={speaking || !voicesLoaded}
      aria-label={speaking ? "Đang đọc" : "Đọc bài viết"}
    >
      {speaking ? "🔊 Đang đọc..." : "🔊 Đọc bài viết"}
    </button>
  );
};

export default TTSButton;