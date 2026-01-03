import React, { useEffect, useState } from "react";
import { Headphones, Play, Pause, Loader2, X } from "lucide-react";
import {
  checkTTSStatus,
  generateTTS,
  getTTSStream,
} from "../../lib/service/tts-service";

interface TTSButtonProps {
  slug: string;
  title?: string;
  description?: string;
  fullContent?: string;
}

const TTSButton: React.FC<TTSButtonProps> = ({
  slug,
  title,
  description,
  fullContent,
}) => {
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [expanded, setExpanded] = useState(false);

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
    setExpanded(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setSpeaking(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnded);
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
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const fmt = (s: number) => {
    if (!s || Number.isNaN(s)) return "00:00";
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  };

  const poll = async (taskId: string) => {
    const max = 240;
    for (let i = 0; i < max; i++) {
      const st = await checkTTSStatus(taskId);
      if (st.status === "ready") return;
      if (st.status === "error") throw new Error(st.error || "TTS failed");
      await new Promise((r) => setTimeout(r, 500));
    }
    throw new Error("TTS timeout");
  };

  const playPause = async () => {
    if (!audio) return;
    try {
      if (speaking) {
        audio.pause();
        setSpeaking(false);
      } else {
        await audio.play();
        setSpeaking(true);
        setExpanded(true);
      }
    } catch {
      setError("Không thể phát âm thanh.");
      setSpeaking(false);
    }
  };

  const start = async () => {
    if (loading) return;

    if (audio) {
      setExpanded(true);
      await playPause();
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

      await poll(taskId);

      const a = new Audio(getTTSStream(taskId));
      a.preload = "metadata";
      a.onerror = () => setError("Lỗi tải âm thanh");

      setAudio(a);
      setExpanded(true);
      setLoading(false);

      try {
        await a.play();
        setSpeaking(true);
      } catch {
        setSpeaking(false);
        setError("Bấm Play để bắt đầu nghe.");
      }
    } catch (e) {
      setLoading(false);
      setSpeaking(false);
      setExpanded(false);
      setError(e instanceof Error ? e.message : "Lỗi không xác định");
    }
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audio) return;
    const t = Number(e.target.value);
    audio.currentTime = t;
    setCurrentTime(t);
  };

  const close = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setSpeaking(false);
    setExpanded(false);
    setCurrentTime(0);
  };

  if (!expanded) {
    return (
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={start}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-60"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Headphones size={16} />
          )}
          <span>{loading ? "Đang tạo giọng đọc..." : audio ? "Tiếp tục nghe" : "Nghe bài viết"}</span>
        </button>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 w-full sm:max-w-md">
      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 shadow-sm">
        <button
          type="button"
          onClick={playPause}
          className="h-10 w-10 rounded-full bg-red-600 text-white hover:bg-red-700 active:scale-95 transition flex items-center justify-center"
          aria-label={speaking ? "Tạm dừng" : "Phát"}
        >
          {speaking ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>

        <div className="flex-1 min-w-[140px]">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={onSeek}
            className="w-full accent-red-600"
          />
          <div className="flex justify-between text-[11px] text-gray-500 dark:text-gray-400 tabular-nums">
            <span>{fmt(currentTime)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={close}
          className="p-2 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          aria-label="Đóng"
        >
          <X size={16} />
        </button>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default TTSButton;
