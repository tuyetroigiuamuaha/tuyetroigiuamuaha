import React, { useState, useRef } from 'react';
import { Mic, MicOff, Loader2, Sparkles } from 'lucide-react';

interface AudioTranscribeButtonProps {
  onTranscribed: (text: string) => void;
  label?: string;
  className?: string;
}

export const AudioTranscribeButton: React.FC<AudioTranscribeButtonProps> = ({
  onTranscribed,
  label = 'Thu âm giọng nói (Gemini AI)',
  className = '',
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      // Determine mimeType supported by browser
      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
        else if (MediaRecorder.isTypeSupported('audio/ogg')) mimeType = 'audio/ogg';
        else mimeType = '';
      }

      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());

        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || 'audio/webm',
        });

        await processAudio(audioBlob);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      console.error('Microphone error:', err);
      setErrorMessage(
        err.name === 'NotAllowedError'
          ? 'Bạn cần cấp quyền truy cập micro trong trình duyệt để thu âm.'
          : 'Không thể truy cập microphone trên thiết bị.'
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (blob: Blob) => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;

        const res = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64Audio,
            mimeType: blob.type || 'audio/webm',
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Lỗi khi phiên âm âm thanh');
        }

        const data = await res.json();
        if (data.text) {
          onTranscribed(data.text.trim());
        } else {
          setErrorMessage('Không nhận diện được giọng nói trong bản ghi.');
        }
        setIsProcessing(false);
      };
    } catch (err: any) {
      console.error('Transcription error:', err);
      setErrorMessage(err.message || 'Lỗi phiên âm giọng nói.');
      setIsProcessing(false);
    }
  };

  return (
    <div className={`inline-flex flex-col items-start ${className}`}>
      <div className="flex items-center gap-2">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-50 dark:bg-purple-950/80 text-rose-700 dark:text-purple-300 hover:bg-rose-100 dark:hover:bg-purple-900 border border-rose-200 dark:border-purple-800 transition-all disabled:opacity-50"
            title="Đọc bằng lời nói để Gemini phiên âm thành văn bản"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600 dark:text-purple-400" />
                <span>Đang chép lời bằng Gemini...</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5 text-rose-500 dark:text-pink-400" />
                <span>{label}</span>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 shadow-sm animate-pulse transition-all"
            title="Nhấn để dừng và chuyển lời nói thành văn bản"
          >
            <MicOff className="w-3.5 h-3.5" />
            <span>Đang thu âm... Nhấn để hoàn tất</span>
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          </button>
        )}
      </div>

      {errorMessage && (
        <span className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 font-normal bg-rose-50 dark:bg-rose-950/80 px-2 py-0.5 rounded-sm border border-rose-200 dark:border-rose-900">
          {errorMessage}
        </span>
      )}
    </div>
  );
};
