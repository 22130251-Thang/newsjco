interface TTSResponse {
  taskId: string;
  status: string;
}

interface StatusResponse {
  status: 'pending' | 'generating' | 'ready' | 'error';
  error?: string;
}

const backendUrl = 'http://localhost:3000';

export const generateTTS = async (
  slug: string,
  title?: string,
  description?: string,
  fullContent?: string
): Promise<string> => {
  try {
    const url = `${backendUrl}/tts/generate`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, title, description, fullContent }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to generate TTS: ${response.status}`);
    }
    
    const data = (await response.json()) as TTSResponse;
    console.log('TTS Response:', data);
    
    return data.taskId;
  } catch (error) {
    console.error('Failed to generate TTS:', error);
    throw new Error('Không thể tạo âm thanh cho bài viết');
  }
};

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
