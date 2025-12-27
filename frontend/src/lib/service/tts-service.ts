import apiClient from '../api.config';

interface TTSResponse {
  audioUrl: string;
  cached: boolean;
}

<<<<<<< HEAD
=======
interface StatusResponse {
  status: 'pending' | 'generating' | 'ready' | 'error';
  error?: string;
}

const backendUrl = 'http://localhost:3000';

>>>>>>> 8535aec (update)
export const generateTTS = async (
  slug: string,
  title?: string,
  description?: string,
  fullContent?: string
): Promise<Blob> => {
  try {
<<<<<<< HEAD
    const response = await apiClient.post<TTSResponse>('tts', {
      slug,
      title,
      description,
      fullContent,
=======
    const url = `${backendUrl}/tts/generate`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, title, description, fullContent }),
>>>>>>> 8535aec (update)
    });
    
    console.log('TTS Response:', response.data);
    
    // Get the audio file as blob
    const audioUrl = response.data.audioUrl;
    // audioUrl is like "/api/tts/filename.mp3"
    // Always use backend API base URL + audioUrl
    const fullUrl = `${import.meta.env.VITE_BACKEND_API}${audioUrl}`;
    
    console.log('Fetching audio from:', fullUrl);
    
    const audioResponse = await fetch(fullUrl);
    
    if (!audioResponse.ok) {
      console.error('Audio response error:', audioResponse.status, audioResponse.statusText);
      throw new Error(`Failed to fetch audio file: ${audioResponse.status}`);
    }
    
    const blob = await audioResponse.blob();
    console.log('Audio blob size:', blob.size);
    
    return blob;
  } catch (error) {
    console.error('Failed to generate TTS:', error);
    throw new Error('Không thể tạo âm thanh cho bài viết');
  }
};
<<<<<<< HEAD
=======

export const checkTTSStatus = async (taskId: string): Promise<StatusResponse> => {
  try {
    const response = await fetch(`${backendUrl}/tts/status/${taskId}`);
    
    if (response.status === 404) throw new Error('Task not found');
    if (response.status === 410) throw new Error('Task expired');
    if (!response.ok) throw new Error('Status check failed');
    
    return response.json();
  } catch (error) {
    console.error('Failed to check TTS status:', error);
    throw new Error('Không thể kiểm tra trạng thái');
  }
};

export const getTTSStream = (taskId: string): string => {
  return `${backendUrl}/tts/stream/${taskId}`;
};
>>>>>>> 8535aec (update)
