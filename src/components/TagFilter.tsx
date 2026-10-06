import React from 'react';
import { Tag as TagIcon, X, Heart } from 'lucide-react';

interface TagFilterProps {
  availableTags: { tag: string; count: number }[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  totalCount: number;
  showFavoritesOnly: boolean;
  onToggleShowFavorites: (show: boolean) => void;
  favoritesCount: number;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  availableTags,
  selectedTag,
  onSelectTag,
  totalCount,
  showFavoritesOnly,
  onToggleShowFavorites,
  favoritesCount,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div className="flex items-center gap-2 mb-3">
        <TagIcon className="w-4 h-4 text-[#f472b6]" />
        <span className="text-xs font-bold text-[#ffdce7] uppercase tracking-wider">
          Lọc theo Thẻ phân loại
        </span>
        {selectedTag && (
          <button
            onClick={() => onSelectTag(null)}
            className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-[#fed7e2] bg-rose-950/80 hover:bg-rose-900 px-2.5 py-1 rounded-full transition-colors border border-rose-800"
          >
            <span>Bỏ lọc (#{selectedTag})</span>
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar py-1">
        {/* All Button */}
        <button
          onClick={() => {
            onToggleShowFavorites(false);
            onSelectTag(null);
          }}
          className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 border ${
            selectedTag === null && !showFavoritesOnly
              ? 'bg-[#842244] text-white border-rose-700 shadow-sm ring-2 ring-rose-950 scale-105'
              : 'bg-slate-900/90 hover:bg-slate-800 text-[#fad2e1] border-rose-900/60 hover:border-rose-500 hover:text-[#ffdce7]'
          }`}
        >
          <span>Hiện tất cả</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              selectedTag === null && !showFavoritesOnly
                ? 'bg-white/25 text-white'
                : 'bg-slate-800 text-[#fbcfe8]'
            }`}
          >
            {totalCount}
          </span>
        </button>

        {/* ❤️ Yêu Thích Button */}
        <button
          onClick={() => {
            onToggleShowFavorites(!showFavoritesOnly);
            onSelectTag(null);
          }}
          className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 border ${
            showFavoritesOnly
              ? 'bg-gradient-to-r from-rose-800 via-pink-700 to-purple-800 text-white border-pink-500 shadow-md ring-2 ring-rose-950 scale-105 animate-pulse'
              : 'bg-slate-900/90 hover:bg-slate-800 text-[#fad2e1] border-rose-900/60 hover:border-rose-500 hover:text-rose-400'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-white text-white' : 'text-rose-400'}`} />
          <span>Danh Sách Yêu Thích</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              showFavoritesOnly
                ? 'bg-white/25 text-white'
                : 'bg-rose-950 text-rose-200 border border-rose-900/40'
            }`}
          >
            {favoritesCount}
          </span>
        </button>

        {/* Individual Tags */}
        {availableTags.map(({ tag, count }) => {
          const isSelected = selectedTag === tag;
          const isR18Tag = tag.toLowerCase() === 'r18' || tag.toLowerCase() === '18+';
          return (
            <button
              key={tag}
              onClick={() => onSelectTag(isSelected ? null : tag)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-[#842244] text-white border-rose-600 shadow-md ring-2 ring-rose-900 scale-105'
                  : isR18Tag
                  ? 'bg-rose-950/70 hover:bg-rose-900 text-rose-200 border-rose-600/80 hover:border-rose-400 shadow-[0_0_10px_rgba(225,29,72,0.2)]'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-[#fad2e1] border-rose-900/60 hover:border-rose-500 hover:text-[#ffdce7]'
              }`}
            >
              <span>{isR18Tag ? `🔞 #${tag}` : `#${tag}`}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected
                    ? 'bg-white/30 text-white'
                    : isR18Tag
                    ? 'bg-rose-900/90 text-rose-100 border border-rose-600'
                    : 'bg-rose-950/80 text-[#fed7e2] border border-rose-900/60'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
