import React, { useState } from "react";
import { generateTTS } from "../lib/service/tts-service";

interface TTSButtonProps {
  slug: string;
  title?: string;
  description?: string;
  fullContent?: string;
}

const TTSButton: React.FC<TTSButtonProps> = ({ slug, title, description, fullContent }) => {
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cleanText = (html?: string) => {
    if (!html) return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  const handleSpeak = async () => {
    try {
      // If audio is already playing, stop it
      if (audio && speaking) {
        audio.pause();
        setSpeaking(false);
        return;
      }

      // If audio element exists, just play/pause
      if (audio) {
        if (speaking) {
          audio.pause();
          setSpeaking(false);
        } else {
          audio.play();
          setSpeaking(true);
        }
        return;
      }

      // Generate TTS if audio doesn't exist yet
      setLoading(true);
      setError(null);
      const cleanedTitle = cleanText(title);
      const cleanedDescription = cleanText(description);
      const cleanedFullContent = cleanText(fullContent);
      
      const audioBlob = await generateTTS(slug, cleanedTitle, cleanedDescription, cleanedFullContent);
      
      // Create blob URL
      const blobUrl = URL.createObjectURL(audioBlob);
      
      // Create and play audio
      const audioElement = new Audio(blobUrl);
      audioElement.onplay = () => setSpeaking(true);
      audioElement.onended = () => setSpeaking(false);
      audioElement.onerror = (e) => {
        console.error('Audio error:', e);
        setError('Lỗi khi phát âm thanh');
        setSpeaking(false);
      };
      
      setAudio(audioElement);
      setLoading(false);
      await audioElement.play();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Lỗi không xác định';
      setError(errorMsg);
      setSpeaking(false);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        className={`px-3 py-2 rounded font-bold text-white bg-red-600 hover:bg-red-700 transition ${
          (speaking || loading) ? "opacity-60 cursor-not-allowed" : ""
        }`}
        onClick={handleSpeak}
        disabled={speaking || loading}
        aria-label={speaking ? "Tạm dừng" : "Đọc bài viết"}
      >
        {loading ? "⏳ Đang chuẩn bị..." : speaking ? "⏸ Tạm dừng" : "🔊 Đọc bài viết"}
      </button>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default TTSButton;