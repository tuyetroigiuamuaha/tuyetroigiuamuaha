import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface NSFWWarningModalProps {
  isOpen: boolean;
  targetName?: string;
  onAccept: () => void;
  onDecline: () => void;
}

export const NSFWWarningModal: React.FC<NSFWWarningModalProps> = ({
  isOpen,
  targetName,
  onAccept,
  onDecline,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900/95 border-2 border-rose-600/80 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(225,29,72,0.35)] text-center text-[#fce4ec] animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Warning Badge Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-950/90 border-2 border-rose-500 text-rose-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse">
          <ShieldAlert className="w-9 h-9 text-rose-400" />
        </div>

        {/* Header Title */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-950/80 border border-rose-600/70 text-rose-300 text-xs font-bold mb-3 uppercase tracking-wider">
          <span>🔞 Xác nhận độ tuổi • Nhãn #R18</span>
        </div>

        <h3 className="font-serif-novel text-xl sm:text-2xl font-extrabold text-[#ffdce7] mb-2 drop-shadow-[0_2px_8px_rgba(244,63,94,0.3)]">
          Cảnh Báo Nội Dung 18+ (NSFW)
        </h3>

        {targetName && (
          <p className="text-xs text-rose-300 font-semibold mb-4 bg-slate-950/70 py-1.5 px-3 rounded-xl border border-rose-900/60 inline-block">
            Mục yêu cầu: <span className="text-[#ffdce7] font-bold">{targetName}</span>
          </p>
        )}

        {/* Content Box with User's Exact Requested Text */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-rose-900/70 text-xs sm:text-sm text-[#fed7e2] leading-relaxed text-justify space-y-3 font-medium mb-6 shadow-inner">
          <p className="text-[#fce4ec]">
            "Đây là nội dung có yếu tố người lớn (NSFW), hãy chắc chắn rằng bạn đã đủ 18 và có đủ nhận thức, cũng như trách nhiệm về hành vi của mình khi truy cập nội dung này.
          </p>
          <p className="italic text-rose-300 text-center font-semibold pt-1 border-t border-rose-950/80">
            (Lời của tác giả : mình xin miễn trừ mọi trách nhiệm có liên quan!) "
          </p>
        </div>

        {/* 2 Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {/* Nút từ chối */}
          <button
            type="button"
            onClick={onDecline}
            className="flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-750 text-[#f8c5d6] hover:text-white transition-all border border-slate-750 flex items-center justify-center gap-2 order-2 sm:order-1"
          >
            <XCircle className="w-4 h-4 text-slate-400" />
            <span>Từ chối xem nội dung (tôi chưa đủ tuổi)</span>
          </button>

          {/* Nút chấp nhận */}
          <button
            type="button"
            onClick={onAccept}
            className="flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-rose-700 via-rose-600 to-pink-600 hover:from-rose-600 hover:to-pink-500 text-white shadow-lg hover:shadow-rose-900/50 transition-all border border-rose-400/50 flex items-center justify-center gap-2 order-1 sm:order-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <CheckCircle className="w-4 h-4 text-white" />
            <span>Chấp nhận xem nội dung (tôi đã đủ tuổi)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
