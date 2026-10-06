import React from 'react';
import {
  Snowflake,
  Sparkles,
  Plus,
  Search,
  BookOpen,
  Flower2,
  MessageSquare,
  Eye,
  Heart,
  Sun,
  Moon,
} from 'lucide-react';
import { ViewMode } from '../types/character';

interface HeaderProps {
  snowEnabled: boolean;
  onToggleSnow: () => void;
  snowType: 'snow' | 'crystal' | 'sakura';
  onToggleSnowType: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCreateModal: () => void;
  totalCharacters: number;
  totalTags: number;
  onNavigate: (mode: ViewMode) => void;
  feedbacksCount: number;
  viewMode?: ViewMode;
  onResetDefaults?: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  snowEnabled,
  onToggleSnow,
  snowType,
  onToggleSnowType,
  searchQuery,
  onSearchChange,
  onOpenCreateModal,
  totalCharacters,
  totalTags,
  onNavigate,
  feedbacksCount,
  viewMode = 'grid',
  onResetDefaults,
  isDarkMode,
  onToggleTheme,
}) => {
  return (
    <header className="relative pt-8 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Decorative ambient blurred orbs */}
      <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none -z-10 bg-rose-950/30" />
      <div className="absolute top-4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none -z-10 bg-purple-950/35" />

      {/* Top Utility Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            onClick={() => onNavigate('grid')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border shadow-xs backdrop-blur-md bg-slate-900/90 border-rose-900/50 text-[#fbcfe8] cursor-pointer hover:border-rose-400 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Kho Tàng Hồ Sơ & Cốt Truyện</span>
          </span>
          <span className="text-xs text-rose-800 hidden sm:inline">•</span>
          <span className="text-xs text-[#f5c2d3] hidden sm:inline font-semibold">
            {totalCharacters} nhân vật • {totalTags} thẻ phân loại
          </span>
        </div>

        {/* Interactive Controls & Feedback Nav */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Feedback buttons */}
          <button
            onClick={() => onNavigate('feedback-submit')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border ${
              viewMode === 'feedback-submit'
                ? 'bg-purple-950/80 text-[#fbcfe8] border-purple-800 ring-2 ring-purple-950'
                : 'bg-slate-950 hover:bg-slate-900 text-[#fbcfe8] border border-purple-900/40'
            }`}
            title="Gửi feedback ẩn danh"
          >
            <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
            <span>Gửi Feedback</span>
          </button>

          {/* Lời động viên gửi đến Hạ button */}
          <button
            onClick={() => onNavigate('encouragement-submit')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border ${
              viewMode === 'encouragement-submit'
                ? 'bg-rose-950/80 text-rose-200 border-rose-800 ring-2 ring-rose-950/60'
                : 'bg-slate-950 hover:bg-slate-900 text-rose-300 border border-pink-900/30'
            }`}
            title="Gửi lời động viên gửi đến Hạ"
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Động Viên Hạ 💖</span>
          </button>

          <button
            onClick={() => onNavigate('feedback-view')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border ${
              viewMode === 'feedback-view'
                ? 'bg-purple-950/80 text-[#fed7e2] border-purple-800 ring-2 ring-purple-950'
                : 'bg-slate-950 hover:bg-slate-900 text-[#fed7e2] border-purple-900/70'
            }`}
            title="Xem danh sách feedback & lời nhắn"
          >
            <Eye className="w-3.5 h-3.5 text-purple-400" />
            <span>Hộp Thư Phản Hồi ({feedbacksCount})</span>
          </button>

          {/* Toggle Snow / Sakura */}
          <button
            onClick={onToggleSnow}
            title={snowEnabled ? 'Tạm tắt tuyết rơi' : 'Bật hiệu ứng tuyết rơi'}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs border ${
              snowEnabled
                ? 'bg-purple-950/80 text-[#fbcfe8] border-purple-800/80 ring-2 ring-purple-950'
                : 'bg-slate-900/80 text-[#d89cad] border-slate-800'
            }`}
          >
            <Snowflake className={`w-3.5 h-3.5 ${snowEnabled ? 'animate-spin' : ''}`} style={{ animationDuration: '9s' }} />
            <span>{snowEnabled ? 'Tuyết rơi: Bật' : 'Tuyết rơi: Tắt'}</span>
          </button>

          {snowEnabled && (
            <button
              onClick={onToggleSnowType}
              title="Đổi kiểu tuyết rơi: Tuyết Lãng Mạn (Rơi Chậm) • Bông Tuyết Pha Lê Lớn • Hoa Đào"
              className="px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-all shadow-xs flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 text-[#fbcfe8] border-rose-900/40"
            >
              {snowType === 'snow' ? (
                <>
                  <Snowflake className="w-3.5 h-3.5 text-pink-300" />
                  <span className="hidden md:inline">Tuyết Lãng Mạn (Rơi Chậm)</span>
                  <span className="md:hidden">Tuyết Chậm</span>
                </>
              ) : snowType === 'crystal' ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" style={{ animationDuration: '8s' }} />
                  <span className="hidden md:inline">Bông Tuyết Pha Lê Lớn</span>
                  <span className="md:hidden">Bông Pha Lê</span>
                </>
              ) : (
                <>
                  <Flower2 className="w-3.5 h-3.5 text-pink-400" />
                  <span className="hidden md:inline">Cánh Hoa Anh Đào</span>
                  <span className="md:hidden">Hoa Đào</span>
                </>
              )}
            </button>
          )}

          {/* Add Character Button */}
          <button
            onClick={onOpenCreateModal}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#842244] hover:bg-[#9c2b53] text-white shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 border border-rose-700/50 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm hồ sơ</span>
          </button>

          {/* Theme Toggler (Dark/Light) */}
          <button
            type="button"
            onClick={onToggleTheme}
            title={isDarkMode ? 'Chuyển sang giao diện Sáng (Light Mode)' : 'Chuyển sang giao diện Tối (Dark Mode)'}
            className="p-1.5 rounded-full text-xs font-semibold flex items-center justify-center transition-all border bg-slate-900/90 hover:bg-slate-800 border-rose-900/50 hover:border-pink-400 text-pink-300 cursor-pointer"
          >
            {isDarkMode ? (
              <Sun className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-blue-500" />
            )}
          </button>
        </div>
      </div>

      {/* Main Title & Poetic Subtitle */}
      <div className="text-center py-6 sm:py-8">
        <div className="inline-block relative">
          <div className="font-script-poetic text-2xl sm:text-3xl select-none mb-1 text-[#fbcfe8] drop-shadow-[0_0_8px_rgba(244,114,182,0.4)] font-bold">
            Thiên Sơn Tuyết Lạc
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif-novel font-extrabold tracking-tight text-[#ffdce7] drop-shadow-[0_2px_12px_rgba(244,114,182,0.3)] cursor-pointer" onClick={() => onNavigate('grid')}>
            Tuyết Rơi Giữa Mùa Hạ
          </h1>
          <div className="h-1 w-24 sm:w-36 mx-auto mt-3 rounded-full bg-gradient-to-r from-pink-300 via-rose-400 to-purple-400 shadow-[0_0_12px_rgba(244,114,182,0.6)]" />
        </div>

        <p className="mt-4 text-base sm:text-xl font-serif-novel italic max-w-2xl mx-auto flex items-center justify-center gap-2 text-[#fce4ec]">
          <span>❄️</span>
          <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ffe4e6] via-[#fbcfe8] to-[#f472b6]">
            Tuyết lạc thiên sơn, tình chôn vạn dặm
          </span>
          <span>❄️</span>
        </p>
      </div>

      {/* Search Bar & Reset */}
      <div className="max-w-xl mx-auto mt-2">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-4 pointer-events-none text-[#f5b8cd]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo tên nhân vật, biệt danh, đặc điểm, tính cách hoặc thẻ..."
            className="w-full pl-11 pr-24 py-3 text-sm rounded-2xl backdrop-blur-md border transition-all shadow-xs outline-none font-medium bg-slate-900/90 border-rose-900/60 focus:border-rose-400 focus:ring-4 focus:ring-rose-950/60 text-[#fed7e2] placeholder:text-[#ab7083]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 px-2 py-1 text-xs rounded-md transition-colors font-bold text-[#fbcfe8] hover:text-white hover:bg-slate-800"
            >
              Xóa tìm
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
