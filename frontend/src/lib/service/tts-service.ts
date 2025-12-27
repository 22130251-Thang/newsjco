import apiClient from '../api.config';

interface TTSResponse {
  audioUrl: string;
  cached: boolean;
}

export const generateTTS = async (
  slug: string,
  title?: string,
  description?: string,
  fullContent?: string
): Promise<Blob> => {
  try {
    const response = await apiClient.post<TTSResponse>('tts', {
      slug,
      title,
      description,
      fullContent,
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
