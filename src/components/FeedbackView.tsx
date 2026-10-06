import React, { useState } from 'react';
import { Character, FeedbackItem, EncouragementItem } from '../types/character';
import {
  MessageSquare,
  ArrowLeft,
  Filter,
  Calendar,
  User,
  ShieldCheck,
  Sparkles,
  Heart,
  Trash2,
} from 'lucide-react';

interface FeedbackViewProps {
  characters: Character[];
  feedbacks: FeedbackItem[];
  encouragements: EncouragementItem[];
  onNavigate: (mode: 'grid' | 'feedback-submit' | 'encouragement-submit') => void;
  onDeleteFeedback?: (id: string) => void;
  onDeleteEncouragement?: (id: string) => void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  characters,
  feedbacks,
  encouragements,
  onNavigate,
  onDeleteFeedback,
  onDeleteEncouragement,
}) => {
  const [activeTab, setActiveTab] = useState<'feedback' | 'encouragement'>('feedback');
  const [selectedFilterChar, setSelectedFilterChar] = useState<string>('all');

  // Filter and sort by newest first
  const filteredFeedbacks = feedbacks
    .filter((fb) => {
      if (selectedFilterChar === 'all') return true;
      return fb.characterName.toLowerCase() === selectedFilterChar.toLowerCase();
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  const sortedEncouragements = [...encouragements].sort((a, b) => b.createdAt - a.createdAt);

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} lúc ${hours}:${minutes}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-300">
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <button
          onClick={() => onNavigate('grid')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-[#f8c5d6] hover:text-[#ffdce7] border border-purple-900/60 shadow-xs transition-all font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chủ</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigate('feedback-submit')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-purple-950/80 hover:bg-purple-900 text-[#fbcfe8] border border-purple-800 shadow-xs transition-all font-bold text-xs"
          >
            <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
            <span>Gửi Feedback</span>
          </button>

          <button
            onClick={() => onNavigate('encouragement-submit')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-rose-900 to-pink-800 hover:from-rose-800 hover:to-pink-700 text-white border border-pink-700/50 shadow-xs transition-all font-bold text-xs"
          >
            <Heart className="w-3.5 h-3.5 text-pink-300" />
            <span>Động Viên Hạ</span>
          </button>
        </div>
      </div>

      {/* Tabs Selector — Phong cách Tím & Xanh Đậm */}
      <div className="flex border-b border-purple-900/50 mb-6 gap-2">
        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex-1 py-3 px-4 rounded-t-2xl font-serif-novel text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-2 border-t border-x ${
            activeTab === 'feedback'
              ? 'bg-purple-950/40 text-[#ffdce7] border-purple-800 border-b-slate-950 shadow-sm'
              : 'border-transparent text-[#d89cad] hover:text-[#ffdce7] hover:bg-slate-900/40'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-pink-400" />
          <span>💬 Feedback Nhân Vật ({feedbacks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('encouragement')}
          className={`flex-1 py-3 px-4 rounded-t-2xl font-serif-novel text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-2 border-t border-x ${
            activeTab === 'encouragement'
              ? 'bg-purple-950/40 text-[#ffdce7] border-purple-800 border-b-slate-950 shadow-sm'
              : 'border-transparent text-[#d89cad] hover:text-[#ffdce7] hover:bg-slate-900/40'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-400" />
          <span>💌 Động Viên Gửi Đến Hạ ({encouragements.length})</span>
        </button>
      </div>

      {/* Header & Filter Bar for active tab */}
      {activeTab === 'feedback' ? (
        <>
          <div className="glass-panel rounded-3xl p-5 sm:p-6 mb-6 border border-purple-900/70 bg-gradient-to-r from-slate-900/95 via-purple-950/40 to-slate-950/95 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-serif-novel text-lg sm:text-xl font-bold text-[#ffdce7] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>Kho Tàng Feedback Ẩn Danh</span>
              </h2>
              <p className="text-xs text-[#d89cad] mt-0.5">
                Xem người đọc viết gì gửi đến các nhân vật yêu thích
              </p>
            </div>

            {/* Character Filter Dropdown */}
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-purple-900/60 text-xs">
              <Filter className="w-3.5 h-3.5 text-pink-400" />
              <span className="font-bold text-[#ffd7e5] hidden sm:inline">Lọc theo nhân vật:</span>
              <select
                value={selectedFilterChar}
                onChange={(e) => setSelectedFilterChar(e.target.value)}
                className="bg-slate-900 text-[11px] font-semibold text-[#fed7e2] border border-purple-900/40 rounded-lg px-2.5 py-1 outline-none"
              >
                <option value="all">🌟 Tất cả nhân vật</option>
                {characters.map((char) => {
                  const count = feedbacks.filter(
                    (fb) => fb.characterName.toLowerCase() === char.name.toLowerCase()
                  ).length;
                  return (
                    <option key={char.id} value={char.name}>
                      {char.avatarIcon || '❄️'} {char.name} ({count})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Feedbacks List */}
          {filteredFeedbacks.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center border border-purple-900/50 space-y-3">
              <p className="text-sm text-[#d89cad]">Chưa có feedback nào cho mục này.</p>
              <button
                onClick={() => onNavigate('feedback-submit')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-950 text-[#fbcfe8] border border-purple-800"
              >
                Gửi feedback ngay 💬
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFeedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="glass-panel rounded-3xl p-5 sm:p-6 border border-purple-900/60 bg-slate-900/90 shadow-lg relative overflow-hidden transition-all hover:border-purple-700/80"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-purple-900/40">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-950 text-[#ffd7e5] border border-purple-800 flex items-center gap-1.5 shadow-xs">
                        <User className="w-3 h-3 text-pink-400" />
                        <span>Gửi đến: {fb.characterName}</span>
                      </span>

                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-950/70 text-[#fed7e2] border border-pink-800/70 flex items-center gap-1.5 shadow-xs">
                        <Sparkles className="w-3 h-3 text-pink-400" />
                        <span>Từ: {fb.senderNickname || 'Người gửi ẩn danh'}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-950 text-purple-300 border border-purple-900/50">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>Ẩn danh</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[#d89cad] flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-pink-400" />
                        <span>{formatDate(fb.createdAt)}</span>
                      </span>

                      {onDeleteFeedback && (
                        <button
                          onClick={() => onDeleteFeedback(fb.id)}
                          className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/50 transition-colors"
                          title="Xóa feedback"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="font-serif-novel text-sm sm:text-base text-[#fce4ec] whitespace-pre-wrap leading-relaxed mb-4">
                    {fb.content}
                  </div>

                  {fb.imageUrl && (
                    <div className="mt-3 pt-3 border-t border-purple-950">
                      <a
                        href={fb.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group relative w-full sm:w-64 rounded-2xl overflow-hidden border border-purple-800/70 shadow-md bg-slate-950"
                      >
                        <img
                          src={fb.imageUrl}
                          alt="Attachment"
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold text-white">
                          🔍 Xem ảnh lớn
                        </div>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Lời động viên gửi đến Hạ list */}
          <div className="glass-panel rounded-3xl p-5 sm:p-6 mb-6 border border-pink-900/40 bg-gradient-to-r from-slate-900/95 via-purple-950/30 to-slate-950/95 shadow-xl">
            <h2 className="font-serif-novel text-lg sm:text-xl font-bold text-[#ffdce7] flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400" />
              <span>Những Lời Động Viên Ấm Áp Gửi Đến Hạ</span>
            </h2>
            <p className="text-xs text-[#d89cad] mt-0.5">
              Nơi lưu giữ từng dòng tâm tư bộc bạch truyền ngọn lửa sáng tạo cho Hạ
            </p>
          </div>

          {sortedEncouragements.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center border border-pink-900/30 space-y-3">
              <p className="text-sm text-[#d89cad]">Chưa có lời động viên nào gửi đến Hạ.</p>
              <button
                onClick={() => onNavigate('encouragement-submit')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#842244] text-white hover:bg-[#9c2b53]"
              >
                Gửi lời nhắn ngay 💌
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedEncouragements.map((ec) => (
                <div
                  key={ec.id}
                  className="glass-panel rounded-3xl p-5 sm:p-6 border border-pink-900/30 bg-slate-900/90 shadow-lg relative overflow-hidden transition-all hover:border-pink-800/50"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-purple-900/35">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-950/70 text-pink-200 border border-pink-900/50 flex items-center gap-1.5 shadow-xs">
                        <Heart className="w-3 h-3 text-rose-400 animate-pulse" />
                        <span>Ký tên: {ec.senderNickname}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-950 text-rose-300">
                        💌 Lời chúc
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[#d89cad] flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-pink-400" />
                        <span>{formatDate(ec.createdAt)}</span>
                      </span>

                      {onDeleteEncouragement && (
                        <button
                          onClick={() => onDeleteEncouragement(ec.id)}
                          className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/50 transition-colors"
                          title="Xóa lời nhắn"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="font-serif-novel text-sm sm:text-base text-[#fce4ec] whitespace-pre-wrap leading-relaxed">
                    {ec.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
