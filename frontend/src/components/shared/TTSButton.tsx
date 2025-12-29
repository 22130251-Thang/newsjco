import React, { useState, useEffect } from "react";
import { checkTTSStatus, generateTTS, getTTSStream } from "../../lib/service/tts-service";

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
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [audio]);

  const cleanText = (html?: string) => {
    if (!html) return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const pollTTSStatus = async (taskId: string): Promise<void> => {
    let attempts = 0;
    const maxAttempts = 120;
    const pollInterval = 500;

    while (attempts < maxAttempts) {
      try {
        const status = await checkTTSStatus(taskId);

        if (status.status === 'ready') {
          return;
        }

        if (status.status === 'error') {
          throw new Error(status.error || 'TTS generation failed');
        }

        await new Promise(resolve => setTimeout(resolve, pollInterval));
        attempts++;
      } catch (err) {
        throw err;
      }
    }

    throw new Error('TTS generation timeout');
  };

  const handleSpeak = async () => {
    try {
      if (audio && speaking) {
        audio.pause();
        setSpeaking(false);
        return;
      }

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

      setLoading(true);
      setError(null);
      const cleanedTitle = cleanText(title);
      const cleanedDescription = cleanText(description);
      const cleanedFullContent = cleanText(fullContent);

      const taskId = await generateTTS(slug, cleanedTitle, cleanedDescription, cleanedFullContent);

      await pollTTSStatus(taskId);

      const audioUrl = getTTSStream(taskId);

      const audioElement = new Audio(audioUrl);
      audioElement.onplay = () => setSpeaking(true);
      audioElement.onended = () => {
        setSpeaking(false);
        setCurrentTime(0);
      };
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

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audio) return;
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 bg-red-600 dark:bg-red-700 rounded px-3 py-2">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={handleSpeak}
          disabled={loading}
          className="flex-shrink-0 text-white hover:opacity-80 transition disabled:opacity-50"
          aria-label={speaking ? "Tạm dừng" : "Đọc bài viết"}
        >
          {loading ? (
            <span className="text-lg">⏳</span>
          ) : speaking ? (
            <span className="text-lg">⏸</span>
          ) : (
            <span className="text-lg">▶</span>
          )}
        </button>

        {/* Progress Bar */}
        {audio && (
          <>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleProgressChange}
              className="flex-1 h-1 bg-red-400 rounded cursor-pointer appearance-none accent-white"
              style={{
                background: `linear-gradient(to right, white 0%, white ${duration ? (currentTime / duration) * 100 : 0
                  }%, rgb(248 113 113) ${duration ? (currentTime / duration) * 100 : 0}%, rgb(248 113 113) 100%)`
              }}
            />
            {/* Duration */}
            <span className="text-white text-xs font-medium whitespace-nowrap">
              {formatTime(currentTime)}/{formatTime(duration)}
            </span>
          </>
        )}

        {/* No Audio Text */}
        {!audio && (
          <span className="text-white text-sm font-medium">🔊 Đọc bài viết</span>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default TTSButton;