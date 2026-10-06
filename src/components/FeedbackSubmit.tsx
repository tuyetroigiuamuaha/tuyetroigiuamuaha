import React, { useState, useRef } from 'react';
import { Character, FeedbackItem } from '../types/character';
import {
  MessageSquare,
  Send,
  Image as ImageIcon,
  Upload,
  X,
  CheckCircle2,
  ArrowLeft,
  Eye,
  Sparkles,
  Dices,
  User,
} from 'lucide-react';

interface FeedbackSubmitProps {
  characters: Character[];
  feedbacks: FeedbackItem[];
  onSaveFeedback: (newFeedback: FeedbackItem) => void;
  onNavigate: (mode: 'grid' | 'feedback-view') => void;
  showToast: (msg: string) => void;
}

const RANDOM_NICKNAMES = [
  'void.passenger',
  'Bé Cún Mùa Đông',
  'Gió Đêm Bắc Từ Liêm',
  'Khách Mất Ngủ 3h Sáng',
  'Cành Đào Tuyết Lạc',
  'Người Nghe Ẩn Danh',
  'Mèo Đêm Thao Thức',
  'Bóng Hình Sau Màn Đêm',
  'Nắng Hạ Vạn Dặm',
  'Bông Tuyết Tan Chậm',
  'Kẻ Mộng Mơ Hà Nội',
  'Trà Chiều Hoàng Hôn',
  'Ánh Trăng Khuyết',
  'Bản Nhạc Nửa Đêm',
  'Hạt Mưa Đầu Mùa',
  'Kẻ Giấu Mặt Dịu Dàng',
  'Tiếng Chuông Gió Xa',
  'Người Tình Mùa Đông',
  'Đêm Dài Không Ngủ',
  'Hương Cà Phê Đắng',
  'Bụi Sao Lạc Lối',
  'Khu Rừng Phủ Tuyết',
  'Tiếng Thở Dài Êm',
  'Cánh Bướm Mùa Hạ',
  'Bí Ẩn Số 07',
  'Cúc Họa Mi Cuối Thu',
  'Hồ Tây Chiều Lộng Gió',
];

export const FeedbackSubmit: React.FC<FeedbackSubmitProps> = ({
  characters,
  feedbacks,
  onSaveFeedback,
  onNavigate,
  showToast,
}) => {
  const [characterName, setCharacterName] = useState(characters[0]?.name || 'Trần Minh Khánh');
  const [customCharacterName, setCustomCharacterName] = useState('');
  const [useCustomName, setUseCustomName] = useState(false);
  const [senderNickname, setSenderNickname] = useState('');
  const [isRolling, setIsRolling] = useState(false);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleRollDice = () => {
    setIsRolling(true);
    const pool = RANDOM_NICKNAMES.filter((n) => n !== senderNickname);
    const picked = pool[Math.floor(Math.random() * pool.length)] || RANDOM_NICKNAMES[0];
    setSenderNickname(picked);
    setTimeout(() => setIsRolling(false), 350);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      alert('Kích thước ảnh quá lớn (tối đa 4MB). Vui lòng chọn ảnh nhỏ hơn.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setImageUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCharName = useCustomName ? customCharacterName.trim() : characterName.trim();
    if (!finalCharName) {
      alert('Vui lòng chọn hoặc nhập tên nhân vật!');
      return;
    }
    if (!content.trim() && !imageUrl) {
      alert('Vui lòng nhập nội dung feedback hoặc đính kèm ảnh!');
      return;
    }

    const finalNickname = senderNickname.trim() || 'Người gửi ẩn danh';

    const newItem: FeedbackItem = {
      id: `fb-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      characterName: finalCharName,
      senderNickname: finalNickname,
      content: content.trim(),
      imageUrl: imageUrl.trim() || undefined,
      createdAt: Date.now(),
    };

    onSaveFeedback(newItem);
    setContent('');
    setImageUrl('');
    setCustomCharacterName('');
    setSenderNickname('');
    showToast(`Gửi feedback ẩn danh thành công! (Ký tên: ${finalNickname}) 💌`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-in fade-in duration-300">
      {/* Top Navigation */}
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
          <span>Xem danh sách Feedback ({feedbacks.length})</span>
        </button>
      </div>

      {/* Main Feedback Box — Phong cách Tím & Xanh Đậm */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-900/70 bg-gradient-to-b from-slate-900/95 via-purple-950/40 to-slate-950/95 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-900/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-purple-900/50">
          <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-800 flex items-center justify-center text-pink-400 shadow-inner">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif-novel text-xl sm:text-2xl font-bold text-[#ffdce7]">
              💬 Gửi Feedback Ẩn Danh
            </h2>
            <p className="text-xs text-[#d89cad]">
              Hoàn toàn ẩn danh • Gửi tâm tư, lời nhắn hoặc góc nhìn đến các nhân vật trong tác phẩm
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Ô 1: Tên nhân vật nhận feedback */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#ffd7e5]">
                1. Tên nhân vật nhận feedback <span className="text-rose-400">*</span>
              </label>
              <button
                type="button"
                onClick={() => setUseCustomName(!useCustomName)}
                className="text-[11px] text-pink-300 hover:underline font-medium"
              >
                {useCustomName ? '← Chọn từ danh sách có sẵn' : '+ Nhập tên tùy chỉnh'}
              </button>
            </div>

            {useCustomName ? (
              <input
                type="text"
                required
                value={customCharacterName}
                onChange={(e) => setCustomCharacterName(e.target.value)}
                placeholder="Nhập tên nhân vật tùy chỉnh (vd: Tác giả, NPC phụ...)"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-purple-900/60 focus:border-pink-400 focus:ring-2 focus:ring-purple-950 outline-none text-sm text-[#fed7e2] placeholder:text-purple-400/50"
              />
            ) : (
              <select
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-purple-900/60 focus:border-pink-400 focus:ring-2 focus:ring-purple-950 outline-none text-sm text-[#fed7e2]"
              >
                {characters.map((char) => (
                  <option key={char.id} value={char.name} className="bg-slate-900 text-[#fed7e2]">
                    {char.avatarIcon || '❄️'} {char.name} ({char.subtitle})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Ô 2: Nhập biệt danh của bạn (Kèm ô xúc xắc tạo ngẫu nhiên) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#ffd7e5] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-pink-400" />
                <span>2. Nhập biệt danh của bạn</span>
              </label>
              <span className="text-[11px] text-purple-300/70 hidden sm:inline">
                Bấm xúc xắc 🎲 để tạo ngẫu nhiên
              </span>
            </div>

            <div className="relative flex items-center">
              <input
                type="text"
                value={senderNickname}
                onChange={(e) => setSenderNickname(e.target.value)}
                placeholder="Nhập biệt danh của bạn (vd: void.passenger, Bé Cún...) hoặc bấm xúc xắc..."
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
            <p className="text-[11px] text-[#d89cad]">
              Có thể tự nhập biệt danh tùy thích hoặc bấm ô xúc xắc để lấy ngẫu nhiên một biệt danh thơ mộng.
            </p>
          </div>

          {/* Ô 3: Nội dung feedback */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#ffd7e5]">
              3. Nội dung Feedback / Tâm tư <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={5}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập lời nhắn, góp ý hoặc cảm xúc của bạn dành cho nhân vật... (Hoàn toàn ẩn danh, thoải mái bày tỏ nhé)"
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-purple-900/60 focus:border-pink-400 focus:ring-2 focus:ring-purple-950 outline-none text-sm font-serif-novel leading-relaxed text-[#fce4ec] placeholder:text-purple-400/50"
            />
          </div>

          {/* Ô 4: Thêm ảnh đính kèm */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#ffd7e5]">
              4. Đính kèm ảnh (Tùy chọn)
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-950/80 border border-purple-900/60">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-800 shadow-xs flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
              >
                <Upload className="w-4 h-4 text-pink-400" />
                <span>Chọn ảnh từ máy (Thư viện)</span>
              </button>

              {imageUrl ? (
                <div className="relative flex items-center gap-3">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-16 h-16 rounded-xl object-cover border border-purple-700 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-red-400 transition-colors text-xs flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Xóa ảnh</span>
                  </button>
                </div>
              ) : (
                <span className="text-xs text-purple-300/60 italic">Chưa có ảnh nào được chọn</span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl text-sm font-bold bg-gradient-to-r from-purple-800 via-pink-700 to-rose-800 hover:from-purple-700 hover:to-rose-700 text-white shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01] border border-pink-500/30"
            >
              <Send className="w-4 h-4 text-pink-200" />
              <span>📤 Gửi feedback ẩn danh</span>
            </button>
            <p className="text-[11px] text-center text-purple-300/60 mt-3 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-pink-400" />
              <span>Hệ thống bảo mật tuyệt đối, chỉ hiển thị biệt danh do bạn chọn hoặc tạo ngẫu nhiên.</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
