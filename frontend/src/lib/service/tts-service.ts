import apiClient from '../api.config';

interface TTSResponse {
  taskId: string;
  status: string;
}

interface StatusResponse {
  status: 'pending' | 'generating' | 'ready' | 'error';
  error?: string;
}

export const generateTTS = async (
  slug: string,
  title?: string,
  description?: string,
  fullContent?: string
): Promise<string> => {
  try {
    const response = await apiClient.post<TTSResponse>('tts/generate', {
      slug,
      title,
      description,
      fullContent,
    });

    console.log('TTS Response:', response.data);
    return response.data.taskId;
  } catch (error) {
    console.error('Failed to generate TTS:', error);
    throw new Error('Không thể tạo âm thanh cho bài viết');
  }
};

export const checkTTSStatus = async (taskId: string): Promise<StatusResponse> => {
  try {
    const response = await apiClient.get<StatusResponse>(`tts/status/${taskId}`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to check TTS status:', error);
    if (error.response?.status === 404) throw new Error('Task not found');
    if (error.response?.status === 410) throw new Error('Task expired');
    throw new Error('Không thể kiểm tra trạng thái');
  }
};

export const getTTSStream = (taskId: string): string => {
  const baseURL = apiClient.defaults.baseURL || 'http://localhost:3000';
  const cleanBase = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
  return `${cleanBase}/tts/stream/${taskId}`;
};

