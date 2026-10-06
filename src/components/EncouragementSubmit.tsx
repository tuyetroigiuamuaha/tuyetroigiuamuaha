import React, { useState } from 'react';
import { EncouragementItem } from '../types/character';
import { Heart, Send, ArrowLeft, Eye, Dices, User, Sparkles } from 'lucide-react';

interface EncouragementSubmitProps {
  encouragements: EncouragementItem[];
  onSaveEncouragement: (newEncouragement: EncouragementItem) => void;
  onNavigate: (mode: 'grid' | 'feedback-view') => void;
  showToast: (msg: string) => void;
}

const RANDOM_AUTHOR_NICKNAMES = [
  'Độc giả giấu tên 🌸',
  'Kẻ Săn Đuổi Bông Tuyết',
  'Người Bạn Mùa Hạ',
  'Trà Chiều Hoàng Hôn 🍵',
  'Ngôi Sao Lấp Lánh ✨',
  'Người Đưa Thư Đêm Muộn',
  'Cúc Họa Mi Trắng',
  'Tâm Hồn Đồng Điệu',
  'void.passenger',
  'Người Kể Chuyện Đêm',
  'Cơn Gió Tháng Sáu',
  'Bông Tuyết Tan Chậm ❄️',
  'Bạn Đọc Trung Thành',
  'Giai Điệu Tương Tư',
  'Kẻ Mộng Mơ Hà Nội',
  'Nắng Ấm Sưởi Ấm',
  'Mèo Con Lười Biếng',
];

export const EncouragementSubmit: React.FC<EncouragementSubmitProps> = ({
  encouragements,
  onSaveEncouragement,
  onNavigate,
  showToast,
}) => {
  const [senderNickname, setSenderNickname] = useState('');
  const [message, setMessage] = useState('');
  const [isRolling, setIsRolling] = useState(false);

  const handleRollDice = () => {
    setIsRolling(true);
    const pool = RANDOM_AUTHOR_NICKNAMES.filter((n) => n !== senderNickname);
    const picked = pool[Math.floor(Math.random() * pool.length)] || RANDOM_AUTHOR_NICKNAMES[0];
    setSenderNickname(picked);
    setTimeout(() => setIsRolling(false), 350);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      alert('Vui lòng nhập lời nhắn gửi đến Hạ!');
      return;
    }

    const finalNickname = senderNickname.trim() || 'Bạn đọc ẩn danh';

    const newItem: EncouragementItem = {
      id: `ec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      senderNickname: finalNickname,
      message: message.trim(),
      createdAt: Date.now(),
    };

    onSaveEncouragement(newItem);
    setMessage('');
    setSenderNickname('');
    showToast(`Đã gửi lời động viên ấm áp đến Hạ! (Ký tên: ${finalNickname}) 💖`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-in fade-in duration-300">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => onNavigate('grid')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-[#f8c5d6] hover:text-[#ffdce7] border border-purple-900/60 shadow-xs transition-all font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chủ</span>
        </button>

        <button
          onClick={() => onNavigate('feedback-view')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-950/80 hover:bg-purple-900 text-[#fbcfe8] border border-purple-800 shadow-xs transition-all font-bold text-sm"
        >
          <Eye className="w-4 h-4 text-pink-400" />
          <span>Xem Lời Động Viên & Feedback ({encouragements.length})</span>
        </button>
      </div>

      {/* Main Form container - Deep Mystical Purple styling */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-pink-900/50 bg-gradient-to-b from-slate-900/95 via-purple-950/30 to-slate-950/95 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-900/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-purple-900/40">
          <div className="w-12 h-12 rounded-2xl bg-rose-950 border border-rose-800/80 flex items-center justify-center text-pink-400 shadow-inner">
            <Heart className="w-6 h-6 text-pink-400 animate-pulse" />
          </div>
          <div>
            <h2 className="font-serif-novel text-xl sm:text-2xl font-bold text-[#ffdce7]">
              💌 Động Viên Gửi Đến Hạ
            </h2>
            <p className="text-xs text-[#d89cad]">
              Hãy viết một vài dòng ngắn để khích lệ, tiếp thêm ngọn lửa nhiệt huyết cho tác giả Hạ nhé!
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Ô điền biệt danh */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#ffd7e5] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-pink-400" />
                <span>Biệt danh của bạn</span>
              </label>
              <span className="text-[11px] text-purple-300/70 hidden sm:inline">
                Nhấp xúc xắc 🎲 để tạo ngẫu nhiên
              </span>
            </div>

            <div className="relative flex items-center">
              <input
                type="text"
                value={senderNickname}
                onChange={(e) => setSenderNickname(e.target.value)}
                placeholder="Nhập biệt danh của bạn hoặc bấm xúc xắc..."
                className="w-full pl-4 pr-24 py-3 rounded-2xl bg-slate-950 border border-purple-900/60 focus:border-pink-400 focus:ring-2 focus:ring-purple-950 outline-none text-sm text-[#fed7e2] placeholder:text-purple-400/50"
              />

              {/* Ô xúc xắc nhỏ */}
              <button
                type="button"
                onClick={handleRollDice}
                title="Bấm xúc xắc để tạo biệt danh ngẫu nhiên"
                className="absolute right-2 px-3 py-1.5 rounded-xl bg-purple-950 hover:bg-purple-800 text-pink-200 hover:text-white border border-purple-700/80 hover:border-pink-500 transition-all flex items-center gap-1.5 shadow-xs group active:scale-95"
              >
                <Dices className={`w-4 h-4 text-pink-400 group-hover:text-pink-200 transition-transform ${isRolling ? 'rotate-180 duration-300' : ''}`} />
                <span className="text-xs font-bold">Xúc xắc</span>
              </button>
            </div>
          </div>

          {/* Ô nhập lời nhắn */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#ffd7e5]">
              Lời nhắn gửi đến Hạ <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={6}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Gửi gắm một vài dòng tâm tư, cảm nhận hay lời động viên ấm áp của bạn dành cho Hạ..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-purple-900/60 focus:border-pink-400 focus:ring-2 focus:ring-purple-950 outline-none text-sm font-serif-novel leading-relaxed text-[#fce4ec] placeholder:text-purple-400/50"
            />
          </div>

          {/* Ô Gửi lời nhắn */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl text-sm font-bold bg-gradient-to-r from-purple-800 via-pink-700 to-rose-800 hover:from-purple-700 hover:to-rose-700 text-white shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01] border border-pink-500/30"
            >
              <Send className="w-4 h-4 text-pink-200" />
              <span>Gửi lời nhắn 💖</span>
            </button>
            <p className="text-[11px] text-center text-purple-300/60 mt-3 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-pink-400" />
              <span>Mỗi lời nhắn gửi đi đều là động lực to lớn giúp Hạ tiếp tục sáng tác!</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
