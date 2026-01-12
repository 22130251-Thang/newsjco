import { useState, useEffect } from "react";
import { Play, Pause, Volume2, Loader2, RotateCcw } from "lucide-react";
import { checkTTSStatus, generateTTS, getTTSStream } from "../../lib/service/tts-service";

interface TTSButtonProps {
  slug: string;
  title?: string;
  description?: string;
  fullContent?: string;
}

const TTSButton = ({ slug, title, description, fullContent }: TTSButtonProps) => {
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.src = "";
    }
    setAudio(null);
    setLoading(false);
    setSpeaking(false);
    setError(null);
    setDuration(0);
    setCurrentTime(0);
  }, [slug]);

  useEffect(() => {
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [audio]);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.src = "";
      }
    };
  }, [audio]);

  const cleanText = (html?: string) => {
    if (!html) return "";
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const pollTTSStatus = async (taskId: string): Promise<void> => {
    let attempts = 0;
    const maxAttempts = 240;
    const pollInterval = 500;

    while (attempts < maxAttempts) {
      const status = await checkTTSStatus(taskId);
      if (status.status === "ready") return;
      if (status.status === "error") throw new Error(status.error || "TTS failed");
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
      attempts++;
    }
    throw new Error("TTS timeout");
  };

  const handleSpeak = async () => {
    if (audio && speaking) {
      audio.pause();
      setSpeaking(false);
      return;
    }

    if (audio) {
      audio.play();
      setSpeaking(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const taskId = await generateTTS(
        slug,
        cleanText(title),
        cleanText(description),
        cleanText(fullContent)
      );
      await pollTTSStatus(taskId);

      const audioElement = new Audio(getTTSStream(taskId));
      audioElement.onplay = () => setSpeaking(true);
      audioElement.onended = () => {
        setSpeaking(false);
        setCurrentTime(0);
      };
      audioElement.onerror = () => {
        setError("Lỗi phát âm thanh");
        setSpeaking(false);
      };

      setAudio(audioElement);
      setLoading(false);
      await audioElement.play();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
      setSpeaking(false);
      setLoading(false);
    }
  };

  const handleRestart = () => {
    if (audio) {
      audio.currentTime = 0;
      audio.play();
      setSpeaking(true);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audio) return;
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 bg-red-600 rounded-lg px-3 py-2 shadow-sm">
        <button
          type="button"
          onClick={handleSpeak}
          disabled={loading}
          className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={16} className="text-white animate-spin" />
          ) : speaking ? (
            <Pause size={16} className="text-white" />
          ) : (
            <Play size={16} className="text-white ml-0.5" />
          )}
        </button>

        {audio ? (
          <>
            <div className="flex-1 flex items-center gap-2">
              <span className="text-xs text-white/80 font-medium w-8 text-right tabular-nums">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleProgressChange}
                className="flex-1 h-1.5 bg-white/30 rounded-full cursor-pointer appearance-none
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-3
                  [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:w-3
                  [&::-moz-range-thumb]:h-3
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-white
                  [&::-moz-range-thumb]:border-0
                  [&::-moz-range-thumb]:cursor-pointer"
                style={{
                  background: `linear-gradient(to right, white ${progress}%, rgba(255,255,255,0.3) ${progress}%)`
                }}
              />
              <span className="text-xs text-white/80 font-medium w-8 tabular-nums">
                {formatTime(duration)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleRestart}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all cursor-pointer"
              title="Phát lại từ đầu"
            >
              <RotateCcw size={14} />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2 text-white">
            <Volume2 size={16} />
            <span className="text-sm font-medium">
              {loading ? "Đang tạo giọng đọc..." : "Nghe bài viết"}
            </span>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default TTSButton;
