import React, { useState, useEffect } from 'react';
import { Character } from '../types/character';
import {
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  Edit2,
  Trash2,
  Sparkles,
  BookOpen,
  Share2,
  Feather,
  Quote,
  Sparkle,
  Lock,
  Unlock,
  KeyRound,
  HelpCircle,
  Eye,
  EyeOff,
  AlertCircle,
  Heart,
} from 'lucide-react';

interface CharacterDetailProps {
  character: Character;
  onBack: () => void;
  onEdit: (character: Character) => void;
  onDelete: (id: string, name: string) => void;
  onSelectTag: (tag: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, name: string) => void;
}

export const CharacterDetail: React.FC<CharacterDetailProps> = ({
  character,
  onBack,
  onEdit,
  onDelete,
  onSelectTag,
  isFavorite,
  onToggleFavorite,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('normal');

  // Link protection & password states
  const hasPassword = Boolean(character.linkPassword && character.linkPassword.trim().length > 0);
  const storageKey = `tuyet_unlocked_link_${character.id}`;

  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    if (!hasPassword) return true;
    try {
      return localStorage.getItem(storageKey) === 'true';
    } catch (e) {
      return false;
    }
  });

  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [unlockSuccessAnimation, setUnlockSuccessAnimation] = useState(false);

  // Reset unlocked state if character changes
  useEffect(() => {
    if (!hasPassword) {
      setIsUnlocked(true);
    } else {
      try {
        setIsUnlocked(localStorage.getItem(storageKey) === 'true');
      } catch (e) {
        setIsUnlocked(false);
      }
    }
    setPasswordInput('');
    setErrorMessage(null);
  }, [character.id, hasPassword, storageKey]);

  // Handle Unlock Password Verification
  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanInput = passwordInput.trim();
    const correctPassword = (character.linkPassword || '').trim();

    if (cleanInput === correctPassword) {
      setIsUnlocked(true);
      setErrorMessage(null);
      setUnlockSuccessAnimation(true);
      setTimeout(() => setUnlockSuccessAnimation(false), 2000);
      try {
        localStorage.setItem(storageKey, 'true');
      } catch (e) {}
    } else {
      setErrorMessage('Sai mất rùi, tình iu thử lại nha 💋');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  // Re-lock handler
  const handleRelock = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {}
    setIsUnlocked(false);
    setPasswordInput('');
    setErrorMessage(null);
  };

  // Copy link handler
  const handleCopyLink = () => {
    if (!character.linkUrl) return;
    navigator.clipboard.writeText(character.linkUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2400);
  };

  // Copy entire profile text
  const handleCopyAllText = () => {
    const text = `❄️ HỒ SƠ NHÂN VẬT: ${character.name} (${character.subtitle})
━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Tuổi: ${character.age || 'Chưa rõ'}
• Giới tính: ${character.gender || 'Chưa rõ'}
• Thân phận: ${character.role || 'Chưa rõ'}
• Trích dẫn: "${character.favoriteQuote || ''}"

【CỐT TRUYỆN CHI TIẾT】
${character.story}

• Thẻ phân loại: ${character.tags.map((t) => '#' + t).join(' ')}
• Liên kết: ${isUnlocked ? character.linkUrl : '[Link được bảo vệ bằng mật khẩu]'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tuyết Rơi Giữa Mùa Hạ — Tuyết lạc thiên sơn, tình chôn vạn dặm ❄️`;

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2400);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 animate-in fade-in duration-300">
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-[#f8c5d6] hover:text-[#ffdce7] border border-rose-900/60 shadow-xs transition-all font-bold text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Quay lại danh sách hồ sơ</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Copy all profile */}
          <button
            onClick={handleCopyAllText}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900/90 hover:bg-slate-800 text-[#f8c5d6] hover:text-[#ffdce7] border border-rose-900/50 transition-all shadow-xs"
            title="Sao chép toàn bộ hồ sơ ra văn bản"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-bold">Đã chép hồ sơ!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#d89cad]" />
                <span>Sao chép hồ sơ</span>
              </>
            )}
          </button>

          {/* Favorite Toggle Button */}
          <button
            onClick={() => onToggleFavorite(character.id, character.name)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs border ${
              isFavorite
                ? 'bg-rose-950/90 text-rose-200 border-rose-700 shadow-md ring-1 ring-rose-950'
                : 'bg-slate-900/90 hover:bg-slate-800 text-[#f8c5d6] hover:text-[#ffdce7] border border-rose-900/50'
            }`}
            title={isFavorite ? 'Bỏ yêu thích nhân vật này' : 'Yêu thích nhân vật này'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500 animate-pulse' : 'text-[#d89cad]'}`} />
            <span>{isFavorite ? 'Đã Yêu Thích' : 'Yêu Thích'}</span>
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(character)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-950/80 hover:bg-rose-900 text-[#fed7e2] border border-rose-800 transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Sửa hồ sơ</span>
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(character.id, character.name)}
            className="p-2 rounded-xl text-[#d89cad] hover:text-red-400 hover:bg-red-950/50 border border-transparent hover:border-red-900/50 transition-all"
            title="Xóa hồ sơ này"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Hero Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden">
        {/* Soft background ambient glow */}
        <div
          className="absolute -top-12 -right-12 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: character.themeColor || '#ec4899' }}
        />

        <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start relative z-10">
          {/* Avatar Section */}
          <div className="relative shrink-0 mx-auto md:mx-0">
            {character.avatarUrl ? (
              <img
                src={character.avatarUrl}
                alt={character.name}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl object-cover border-4 border-rose-900/80 shadow-md"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : null}

            <div
              className={`flex items-center justify-center rounded-3xl shadow-sm text-4xl border border-rose-900/60 ${
                character.avatarUrl
                  ? 'absolute -bottom-2 -right-2 w-11 h-11 text-xl bg-slate-900 rounded-2xl shadow-md border-rose-800'
                  : 'w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-purple-950 via-slate-900 to-rose-950'
              }`}
            >
              <span>{character.avatarIcon || '❄️'}</span>
            </div>
          </div>

          {/* Name & Titles */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1.5">
              <h1 className="font-serif-novel text-3xl sm:text-4xl font-extrabold text-[#ffdce7]">
                {character.name}
              </h1>
              {character.age && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-950 text-[#fed7e2] font-bold border border-rose-800">
                  {character.age}
                </span>
              )}
              {character.gender && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950 text-[#fed7e2] font-bold border border-purple-800">
                  {character.gender}
                </span>
              )}
              {hasPassword && (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 font-bold border border-amber-800/80 shadow-xs">
                  {isUnlocked ? <Unlock className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3 text-amber-300" />}
                  <span>{isUnlocked ? 'Đã mở khoá link' : 'Link có mật khẩu'}</span>
                </span>
              )}
            </div>

            <p className="text-base font-bold text-[#f9a8d4] mb-2">
              {character.subtitle}
            </p>

            {character.role && (
              <p className="text-xs text-[#f5b8cd] font-semibold italic mb-3">
                {character.role}
              </p>
            )}

            {/* Favorite Quote Banner */}
            {character.favoriteQuote && (
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-rose-900/60 text-xs sm:text-sm italic text-[#fed7e2] flex items-start gap-2.5 max-w-xl mx-auto md:mx-0 shadow-xs mb-4">
                <Quote className="w-4 h-4 text-rose-300 shrink-0 mt-0.5 rotate-180" />
                <span className="font-serif-novel font-semibold">"{character.favoriteQuote}"</span>
              </div>
            )}

            {/* Tags on Detail */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5">
              {character.tags.map((tag) => {
                const isTagR18 = tag.toLowerCase() === 'r18' || tag.toLowerCase() === '18+';
                return (
                  <button
                    key={tag}
                    onClick={() => {
                      onSelectTag(tag);
                      onBack();
                    }}
                    className={`text-xs px-3 py-1 rounded-full transition-colors shadow-2xs font-bold border ${
                      isTagR18
                        ? 'bg-rose-950 text-rose-200 border-rose-600 hover:bg-rose-900 shadow-[0_0_8px_rgba(225,29,72,0.3)]'
                        : 'bg-rose-950/80 hover:bg-rose-900 text-[#fed7e2] border-rose-800/70'
                    }`}
                  >
                    {isTagR18 ? `🔞 #${tag}` : `#${tag}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Full Novel Story Section with High Readability Nude Pink Text */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-rose-900/40">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#f472b6]" />
            <h2 className="font-serif-novel text-xl font-bold text-[#ffdce7]">
              Cốt truyện chi tiết
            </h2>
          </div>

          {/* Font size controller */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-rose-900/50 text-xs">
            <span className="text-[11px] text-[#d89cad] px-1.5 font-bold">Cỡ chữ:</span>
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-0.5 rounded-lg transition-colors font-bold ${
                fontSize === 'normal'
                  ? 'bg-[#842244] text-white'
                  : 'text-[#f8c5d6] hover:bg-slate-800'
              }`}
            >
              Vừa
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-0.5 rounded-lg transition-colors font-bold ${
                fontSize === 'large'
                  ? 'bg-[#842244] text-white'
                  : 'text-[#f8c5d6] hover:bg-slate-800'
              }`}
            >
              Lớn
            </button>
            <button
              onClick={() => setFontSize('huge')}
              className={`px-2 py-0.5 rounded-lg transition-colors font-bold ${
                fontSize === 'huge'
                  ? 'bg-[#842244] text-white'
                  : 'text-[#f8c5d6] hover:bg-slate-800'
              }`}
            >
              Đại
            </button>
          </div>
        </div>

        {/* Story Body with novel dropcap - Highly legible nude pink text */}
        <div
          className={`font-serif-novel text-[#fce4ec] leading-loose space-y-4 font-normal ${
            fontSize === 'normal'
              ? 'text-base sm:text-lg'
              : fontSize === 'large'
              ? 'text-lg sm:text-xl'
              : 'text-xl sm:text-2xl'
          }`}
        >
          {character.story.split('\n\n').map((paragraph, idx) => (
            <p
              key={idx}
              className={idx === 0 ? 'novel-dropcap text-justify' : 'text-justify'}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* 📋 KHỐI LIÊN KẾT: Khoá Link + Link Gợi ý Mật khẩu */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 mb-8 relative overflow-hidden transition-all duration-300">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            {hasPassword ? (
              isUnlocked ? (
                <Unlock className="w-5 h-5 text-emerald-400 animate-in zoom-in-50" />
              ) : (
                <Lock className="w-5 h-5 text-amber-400 animate-pulse" />
              )
            ) : (
              <ExternalLink className="w-5 h-5 text-[#f472b6]" />
            )}

            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#ffdce7] tracking-wide flex items-center gap-2">
                <span>{character.linkTitle || 'Đường dẫn liên kết bí mật'}</span>
                {hasPassword && (
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border transition-colors ${
                      isUnlocked
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                        : 'bg-rose-950/90 text-rose-300 border-rose-800/80'
                    }`}
                  >
                    {isUnlocked ? '🔓 Đã mở khoá' : '🔒 Bị khoá'}
                  </span>
                )}
              </h3>
            </div>
          </div>

          {/* Nút Xem Gợi Ý */}
          {character.passwordHintLink && (
            <a
              href={character.passwordHintLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 border border-amber-800/70 shadow-xs hover:scale-105 transition-all"
              title="Mở liên kết gợi ý mật khẩu"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
              <span>{character.passwordHintText || 'Xem gợi ý mật khẩu'}</span>
              <ExternalLink className="w-3 h-3 text-amber-400" />
            </a>
          )}
        </div>

        {/* TRƯỜNG HỢP 1: CÓ MẬT KHẨU VÀ CHƯA MỞ KHÓA */}
        {hasPassword && !isUnlocked ? (
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-rose-900/60 shadow-inner">
            <div className="flex flex-col items-center text-center max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-950/70 border border-rose-800/80 flex items-center justify-center text-amber-300 shadow-md">
                <Lock className="w-7 h-7 text-amber-300" />
              </div>

              <div>
                <h4 className="text-base font-serif-novel font-bold text-[#ffdce7]">
                  Liên kết này được bảo vệ bằng mật khẩu
                </h4>
                <p className="text-xs text-[#fad2e1] mt-1 leading-relaxed">
                  Vui lòng nhập mật khẩu để mở khóa và xem đường link.
                </p>
                {character.passwordCustomHint && (
                  <div className="mt-2.5 px-3 py-2 rounded-xl bg-amber-950/40 border border-amber-900/50 text-xs text-amber-300/90 italic font-medium inline-block">
                    💡 {character.passwordCustomHint}
                  </div>
                )}
              </div>

              {/* Form nhập mật khẩu */}
              <form onSubmit={handleUnlock} className={`w-full space-y-3 ${isShaking ? 'animate-bounce' : ''}`}>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#f5b8cd]" />
                  <input
                    type={showPasswordText ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Nhập mật khẩu mở khóa..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-rose-900/70 focus:border-rose-400 focus:ring-2 focus:ring-rose-950 text-sm text-[#fed7e2] placeholder:text-[#a1687b] outline-none"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordText(!showPasswordText)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#d89cad] hover:text-[#fed7e2] transition-colors"
                    title={showPasswordText ? 'Ẩn mật khẩu' : 'Xem mật khẩu'}
                  >
                    {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Error message */}
                {errorMessage && (
                  <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-800 text-xs text-rose-200 font-semibold flex items-center justify-center gap-1.5 animate-in fade-in duration-200">
                    <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="flex gap-2 justify-center pt-1">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#842244] to-[#a12e54] hover:from-[#9c2b53] hover:to-[#b53a63] text-white shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Mở khoá</span>
                  </button>

                  {character.passwordHintLink && (
                    <a
                      href={character.passwordHintLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-950/60 hover:bg-amber-900/80 text-amber-200 border border-amber-800/60 flex items-center gap-1.5 transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{character.passwordHintText || 'Xem gợi ý'}</span>
                    </a>
                  )}
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* TRƯỜNG HỢP 2: ĐÃ MỞ KHÓA HOẶC KHÔNG CÓ MẬT KHẨU */
          <div>
            {unlockSuccessAnimation && (
              <div className="mb-3 p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-xs text-emerald-200 font-semibold flex items-center justify-center gap-2 animate-in zoom-in-95">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Mật khẩu chính xác! Đã mở khóa liên kết thành công ✨</span>
              </div>
            )}

            {character.linkUrl ? (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-rose-900/70 text-xs font-mono text-[#fed7e2] font-semibold truncate shadow-2xs select-all">
                    {character.linkUrl}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-950 hover:bg-rose-900 text-[#fed7e2] transition-colors shadow-2xs border border-rose-800"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Đã sao chép!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép link</span>
                        </>
                      )}
                    </button>

                    <a
                      href={character.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#842244] hover:bg-[#9c2b53] text-white transition-colors shadow-xs border border-rose-700/50"
                    >
                      <span>Mở tab mới</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {hasPassword && (
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleRelock}
                      className="inline-flex items-center gap-1 text-[11px] text-[#d89cad] hover:text-amber-300 font-semibold transition-colors"
                      title="Khoá lại liên kết trên trình duyệt này"
                    >
                      <Lock className="w-3 h-3" />
                      <span>Khoá lại link này</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#d89cad] italic font-medium">
                Chưa có đường link liên kết nào cho nhân vật này. Bạn có thể nhấn "Sửa hồ sơ" để thêm link.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
