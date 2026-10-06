import React from 'react';
import { Character } from '../types/character';
import {
  ExternalLink,
  ChevronRight,
  Heart,
  Edit2,
  Trash2,
  Share2,
  Sparkles,
  Lock,
} from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  onSelect: (character: Character) => void;
  onEdit: (character: Character) => void;
  onDelete: (id: string, name: string) => void;
  onSelectTag: (tag: string) => void;
  selectedTag: string | null;
  isFavorite: boolean;
  onToggleFavorite: (id: string, name: string) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onSelect,
  onEdit,
  onDelete,
  onSelectTag,
  selectedTag,
  isFavorite,
  onToggleFavorite,
}) => {
  const hasPassword = Boolean(character.linkPassword && character.linkPassword.trim().length > 0);
  const isCharacterR18 = character.tags.some(
    (t) => t.toLowerCase() === 'r18' || t.toLowerCase() === '18+'
  );

  return (
    <div
      onClick={() => onSelect(character)}
      className="group relative cursor-pointer glass-panel glass-panel-hover rounded-3xl p-5 flex flex-col justify-between overflow-hidden transition-all duration-300"
    >
      {/* Top background accent glow */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none -mr-8 -mt-8"
        style={{ backgroundColor: character.themeColor || '#f472b6' }}
      />

      {/* Absolute top-right Favorite Heart toggle */}
      <button
        type="button"
        title={isFavorite ? 'Bỏ yêu thích' : 'Yêu thích nhân vật'}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(character.id, character.name);
        }}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/80 hover:bg-slate-900 text-[#f8c5d6] hover:text-white border border-purple-900/50 hover:border-pink-500/50 shadow-md transition-all active:scale-90 group/fav"
      >
        <Heart
          className={`w-4 h-4 transition-all duration-300 ${
            isFavorite
              ? 'fill-rose-500 text-rose-500 scale-110'
              : 'text-[#d89cad] group-hover/fav:text-rose-400 group-hover/fav:scale-110'
          }`}
        />
      </button>

      <div>
        {/* Header: Avatar / Icon + Name + Subtitle */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className="relative shrink-0">
            {character.avatarUrl ? (
              <img
                src={character.avatarUrl}
                alt={character.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-rose-900/80 shadow-xs group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : null}

            {/* Icon badge or fallback icon */}
            <div
              className={`flex items-center justify-center rounded-2xl shadow-xs text-xl border ${
                character.avatarUrl
                  ? 'absolute -bottom-1 -right-1 w-6 h-6 text-xs bg-slate-900 border-rose-800 rounded-full'
                  : 'w-14 h-14 bg-gradient-to-br from-purple-950 to-slate-900 border-rose-900/60'
              }`}
            >
              <span>{character.avatarIcon || '❄️'}</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-serif-novel text-lg sm:text-xl font-bold text-[#ffdce7] group-hover:text-[#fbcfe8] transition-colors truncate">
                {character.name}
              </h3>
              {isCharacterR18 && (
                <span className="inline-flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full bg-rose-950/90 text-rose-200 font-extrabold border border-rose-600 shadow-[0_0_8px_rgba(225,29,72,0.3)]">
                  <span>🔞 R18</span>
                </span>
              )}
              {character.age && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-[#f8c5d6] font-bold border border-rose-900/50">
                  {character.age}
                </span>
              )}
              {hasPassword && (
                <span className="inline-flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full bg-amber-950/70 text-amber-300 font-bold border border-amber-800/60" title="Hồ sơ có link bảo vệ bằng mật khẩu">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Khoá link</span>
                </span>
              )}
            </div>

            <p className="text-xs font-bold text-[#f9a8d4] truncate mt-0.5">
              {character.subtitle || 'Nhân vật trong Tuyết Rơi Giữa Mùa Hạ'}
            </p>

            {character.role && (
              <p className="text-[11px] text-[#f5b8cd] truncate mt-0.5 italic font-medium">
                {character.role}
              </p>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4 mt-2">
          {character.tags.map((tag) => {
            const isTagR18 = tag.toLowerCase() === 'r18' || tag.toLowerCase() === '18+';
            return (
              <button
                key={tag}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTag(tag);
                }}
                className={`text-[11px] px-2.5 py-0.5 rounded-full transition-colors font-bold ${
                  selectedTag === tag
                    ? 'bg-[#842244] text-white shadow-xs border border-rose-700'
                    : isTagR18
                    ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-600/70 shadow-[0_0_6px_rgba(225,29,72,0.25)]'
                    : 'bg-slate-900/90 hover:bg-purple-950 text-[#fad2e1] hover:text-[#ffdce7] border border-rose-900/50'
                }`}
              >
                {isTagR18 ? `🔞 #${tag}` : `#${tag}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer: Quick Actions + Details Link */}
      <div className="pt-3 border-t border-purple-900/40 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Chỉnh sửa hồ sơ"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(character);
            }}
            className="p-1.5 rounded-lg text-[#d89cad] hover:text-[#ffdce7] hover:bg-purple-950/60 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            title="Xóa hồ sơ này"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(character.id, character.name);
            }}
            className="p-1.5 rounded-lg text-[#d89cad] hover:text-red-400 hover:bg-red-950/60 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="inline-flex items-center gap-1 text-xs font-bold text-[#f472b6] group-hover:translate-x-0.5 transition-transform">
          <span>Xem chi tiết</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
