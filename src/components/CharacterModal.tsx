import React, { useState, useEffect, useRef } from 'react';
import { Character } from '../types/character';
import {
  X,
  Save,
  Sparkles,
  Link as LinkIcon,
  Tag as TagIcon,
  User,
  BookOpen,
  Image as ImageIcon,
  Loader2,
  Lock,
  KeyRound,
  HelpCircle,
  ExternalLink,
  ShieldAlert,
  Camera,
  Check,
  Upload,
} from 'lucide-react';
import { AudioTranscribeButton } from './AudioTranscribeButton';

interface CharacterModalProps {
  isOpen: boolean;
  characterToEdit: Character | null;
  onClose: () => void;
  onSave: (character: Character) => void;
  existingTags: string[];
}

const PRESET_ICONS = ['❄️', '☀️', '🌸', '🌙', '🕊️', '🎭', '🎋', '✨', '🗡️', '🍵'];
const PRESET_THEME_COLORS = [
  '#f59e0b', // Amber/gold
  '#38bdf8', // Ice blue
  '#ec4899', // Pink blossom
  '#8b5cf6', // Violet
  '#10b981', // Emerald
  '#f43f5e', // Rose
  '#64748b', // Slate
];

const PRESET_AVATAR_GALLERY = [
  { name: 'Nắng ấm', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
  { name: 'Giọt tuyết', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80' },
  { name: 'Bí ẩn', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
  { name: 'Thanh tao', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80' },
  { name: 'Trầm mặc', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80' },
  { name: 'Lãng mạn', url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=600&q=80' },
];

export const CharacterModal: React.FC<CharacterModalProps> = ({
  isOpen,
  characterToEdit,
  onClose,
  onSave,
  existingTags,
}) => {
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [role, setRole] = useState('');
  const [summary, setSummary] = useState('');
  const [story, setStory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');

  // 3 ô liên kết & bảo mật:
  const [passwordHintLink, setPasswordHintLink] = useState('');
  const [passwordHintText, setPasswordHintText] = useState('');
  const [linkPassword, setLinkPassword] = useState('');
  const [passwordCustomHint, setPasswordCustomHint] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');

  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarIcon, setAvatarIcon] = useState('❄️');
  const [themeColor, setThemeColor] = useState('#ec4899');
  const [favoriteQuote, setFavoriteQuote] = useState('');

  // AI assist states
  const [isEnhancingWithAI, setIsEnhancingWithAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize form when editing or creating
  useEffect(() => {
    if (characterToEdit) {
      setName(characterToEdit.name || '');
      setSubtitle(characterToEdit.subtitle || '');
      setAge(characterToEdit.age || '');
      setGender(characterToEdit.gender || '');
      setRole(characterToEdit.role || '');
      setSummary(characterToEdit.summary || '');
      setStory(characterToEdit.story || '');
      setTags(characterToEdit.tags || []);
      setPasswordHintLink(characterToEdit.passwordHintLink || '');
      setPasswordHintText(characterToEdit.passwordHintText || '');
      setLinkPassword(characterToEdit.linkPassword || '');
      setPasswordCustomHint(characterToEdit.passwordCustomHint || '');
      setLinkUrl(characterToEdit.linkUrl || '');
      setLinkTitle(characterToEdit.linkTitle || '');
      setAvatarUrl(characterToEdit.avatarUrl || '');
      setAvatarIcon(characterToEdit.avatarIcon || '❄️');
      setThemeColor(characterToEdit.themeColor || '#ec4899');
      setFavoriteQuote(characterToEdit.favoriteQuote || '');
    } else {
      // Defaults for new character
      setName('');
      setSubtitle('Giọt tuyết mùa hạ');
      setAge('18 tuổi');
      setGender('Nữ');
      setRole('Nhân vật tiểu thuyết');
      setSummary('');
      setStory('');
      setTags(['Tuyết', 'Bí_ẩn', 'Dịu_dàng']);
      setPasswordHintLink('');
      setPasswordHintText('');
      setLinkPassword('');
      setPasswordCustomHint('');
      setLinkUrl('');
      setLinkTitle('');
      setAvatarUrl('https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80');
      setAvatarIcon('❄️');
      setThemeColor('#38bdf8');
      setFavoriteQuote('');
    }
    setAiError(null);
  }, [characterToEdit, isOpen]);

  if (!isOpen) return null;

  // Handle Local Image File Upload
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
        setAvatarUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Add tag
  const handleAddTag = (rawTag: string) => {
    const cleaned = rawTag.trim().replace(/^#/, '').replace(/\s+/g, '_');
    if (cleaned && !tags.includes(cleaned)) {
      setTags([...tags, cleaned]);
    }
    setNewTagInput('');
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // AI enhance with gemini-3.8-flash
  const handleEnhanceWithAI = async () => {
    if (!name.trim()) {
      alert('Vui lòng nhập tên nhân vật trước khi nhờ AI trau chuốt.');
      return;
    }

    setIsEnhancingWithAI(true);
    setAiError(null);

    try {
      const res = await fetch('/api/gemini/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'enhance_profile',
          characterData: {
            name,
            subtitle,
            age,
            role,
            summary,
            story,
            tags,
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Không thể kết nối đến dịch vụ AI');
      }

      const data = await res.json();
      let parsed;
      try {
        const cleaned = data.text.replace(/```json\n?|\n?```/g, '').trim();
        parsed = JSON.parse(cleaned);
      } catch (e) {
        // Fallback if not valid json
        setStory((prev) => (prev ? prev + '\n\n' + data.text : data.text));
        setIsEnhancingWithAI(false);
        return;
      }

      if (parsed.summary) {
        setSummary(parsed.summary);
      }

      if (parsed.story) {
        setStory(parsed.story);
      }

      if (parsed.quote && !favoriteQuote) {
        setFavoriteQuote(parsed.quote);
      }

      if (parsed.suggestedTags && Array.isArray(parsed.suggestedTags)) {
        const merged = Array.from(new Set([...tags, ...parsed.suggestedTags]));
        setTags(merged);
      }

      setIsEnhancingWithAI(false);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Lỗi khi gọi AI trau chuốt.');
      setIsEnhancingWithAI(false);
    }
  };

  // Handle Save
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Vui lòng nhập tên nhân vật!');
      return;
    }

    const updatedCharacter: Character = {
      id: characterToEdit ? characterToEdit.id : `char-${Date.now()}`,
      name: name.trim(),
      subtitle: subtitle.trim() || 'Nhân vật',
      age: age.trim(),
      gender: gender.trim(),
      role: role.trim(),
      summary: summary.trim() || `Hồ sơ về ${name.trim()} trong Tuyết Rơi Giữa Mùa Hạ.`,
      story:
        story.trim() ||
        `${name.trim()} đứng giữa hai bờ tuyết trắng và nắng hạ, tìm kiếm lời giải cho khúc tương tư vạn dặm...`,
      tags: tags.length > 0 ? tags : ['Tuyết_Rơi_Giữa_Mùa_Hạ'],
      
      // 3 ô liên kết & bảo mật:
      passwordHintLink: passwordHintLink.trim(),
      passwordHintText: passwordHintText.trim(),
      linkPassword: linkPassword.trim(),
      passwordCustomHint: passwordCustomHint.trim(),
      linkUrl: linkUrl.trim(),
      linkTitle: linkTitle.trim() || 'Tài liệu liên quan',

      avatarUrl: avatarUrl.trim(),
      avatarIcon,
      themeColor,
      favoriteQuote: favoriteQuote.trim(),
      createdAt: characterToEdit ? characterToEdit.createdAt : Date.now(),
      updatedAt: Date.now(),
    };

    onSave(updatedCharacter);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl my-6 bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-rose-900/70 overflow-hidden flex flex-col max-h-[92vh] text-[#f9ccd9]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-rose-900/50 flex items-center justify-between bg-gradient-to-r from-rose-950/60 via-slate-900 to-indigo-950/60 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">{avatarIcon}</span>
            <div>
              <h2 className="font-serif-novel text-xl font-bold text-[#ffd7e5]">
                {characterToEdit ? 'Chỉnh sửa hồ sơ nhân vật' : 'Thêm hồ sơ nhân vật mới'}
              </h2>
              <p className="text-xs text-[#f9a8d4]">
                Tuyết Rơi Giữa Mùa Hạ • Dữ liệu lưu tự động trên trình duyệt
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#d89cad] hover:text-[#ffdce7] hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {/* AI Assistance Quick Bar */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-purple-950/60 border border-rose-900/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#f472b6] animate-spin" style={{ animationDuration: '8s' }} />
              <div>
                <span className="font-semibold text-[#ffd7e5] block text-xs">
                  Trợ lý sáng tác Gemini AI
                </span>
                <span className="text-[11px] text-[#f5c2d3] block">
                  Nhập tên và giới thiệu sơ lược, sau đó bấm để AI tự động trau chuốt cốt truyện văn học!
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleEnhanceWithAI}
              disabled={isEnhancingWithAI}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#b93863] via-[#c0587e] to-[#a84268] hover:from-[#a12e54] hover:to-[#913758] text-white shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              {isEnhancingWithAI ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang sáng tác...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Trau chuốt hồ sơ</span>
                </>
              )}
            </button>
          </div>

          {aiError && (
            <div className="p-2.5 rounded-xl bg-rose-950/60 text-[#fed7e2] text-xs border border-rose-900/60">
              {aiError}
            </div>
          )}

          {/* 1. Basic Info: Name, Subtitle, Age, Gender, Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#ffd7e5] mb-1">
                Tên nhân vật <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Hạ An, Băng Nhi, Trần Minh Khánh..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-rose-900/60 focus:border-rose-400 focus:ring-2 focus:ring-rose-950 outline-none text-[#fed7e2] placeholder:text-[#a1687b]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#ffd7e5] mb-1">
                Biệt danh / Danh hiệu ngắn
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Ví dụ: Nắng ấm, Giọt tuyết, Đàn em khóa dưới..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-rose-900/60 focus:border-rose-400 focus:ring-2 focus:ring-rose-950 outline-none text-[#fed7e2] placeholder:text-[#a1687b]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#ffd7e5] mb-1">
                Tuổi
              </label>
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Ví dụ: 18 tuổi"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-rose-900/60 focus:border-rose-400 focus:ring-2 focus:ring-rose-950 outline-none text-[#fed7e2] placeholder:text-[#a1687b]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#ffd7e5] mb-1">
                Giới tính / Xưng hô
              </label>
              <input
                type="text"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                placeholder="Nữ, Nam, hoặc Em/Chị/Anh..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-rose-900/60 focus:border-rose-400 focus:ring-2 focus:ring-rose-950 outline-none text-[#fed7e2] placeholder:text-[#a1687b]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#ffd7e5] mb-1">
                Thân phận / Vai trò
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Ví dụ: Thiếu nữ ánh dương • Ban Truyền thông..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-rose-900/60 focus:border-rose-400 focus:ring-2 focus:ring-rose-950 outline-none text-[#fed7e2] placeholder:text-[#a1687b]"
              />
            </div>
          </div>

          {/* 2. Visual & Avatar Customization Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-rose-900/60 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-rose-900/40 pb-2.5">
              <Camera className="w-4 h-4 text-pink-400" />
              <h3 className="text-xs font-bold text-[#ffd7e5] uppercase tracking-wider">
                Tùy chỉnh Ảnh đại diện (Chọn ảnh từ máy hoặc mẫu có sẵn)
              </h3>
            </div>

            {/* Live Avatar Preview + Local Upload Button */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-900/80 border border-rose-900/50">
              <div className="relative shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Preview"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-rose-700 shadow-md"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-purple-950 border-2 border-rose-800 flex items-center justify-center text-3xl">
                    {avatarIcon}
                  </div>
                )}
                <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-xl bg-slate-900 border border-rose-700 flex items-center justify-center text-sm shadow-xs">
                  {avatarIcon}
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <div>
                  <h4 className="text-xs font-bold text-[#ffd7e5]">Ảnh đại diện nhân vật</h4>
                  <p className="text-[11px] text-[#f8c5d6] mt-0.5">
                    Tải ảnh từ thiết bị của bạn, chọn ảnh chân dung mẫu, hoặc dán đường dẫn URL.
                  </p>
                </div>

                {/* Local File Input & Button */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
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
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-pink-400" />
                    <span>Chọn ảnh từ máy (Tải tệp lên)</span>
                  </button>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="px-2.5 py-1.5 rounded-xl text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-[#d89cad] transition-colors"
                    >
                      Xóa ảnh
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Preset Icons Selection */}
            <div>
              <label className="block text-xs font-bold text-[#ffd7e5] mb-1.5">
                Chọn biểu tượng Emoji biểu trưng
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setAvatarIcon(icon)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border transition-transform ${
                      avatarIcon === icon
                        ? 'bg-rose-950 border-rose-400 shadow-xs scale-110 ring-2 ring-rose-900'
                        : 'bg-slate-900 border-rose-900/40 hover:bg-slate-800'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Preset Aesthetic Portrait Gallery */}
            <div>
              <label className="block text-xs font-bold text-[#ffd7e5] mb-1.5">
                Gợi ý chân dung mẫu có sẵn (Bấm để chọn nhanh)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PRESET_AVATAR_GALLERY.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(item.url)}
                    className={`group relative rounded-xl overflow-hidden border-2 transition-all ${
                      avatarUrl === item.url
                        ? 'border-pink-500 ring-2 ring-pink-900 scale-105'
                        : 'border-rose-900/50 hover:border-rose-400'
                    }`}
                    title={item.name}
                  >
                    <img src={item.url} alt={item.name} className="w-full h-16 object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 text-[10px] text-center text-[#fed7e2] py-0.5 font-medium truncate">
                      {item.name}
                    </div>
                    {avatarUrl === item.url && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-pink-600 text-white flex items-center justify-center text-[9px]">
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Avatar URL Input */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-[#f5c2d3] mb-1">
                  Hoặc dán đường dẫn ảnh đại diện tùy chỉnh (URL)
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-rose-900/60 focus:border-rose-400 outline-none text-xs text-[#fed7e2] placeholder:text-[#a1687b]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#f5c2d3] mb-1">
                  Tông màu chủ đạo
                </label>
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex gap-1.5">
                    {PRESET_THEME_COLORS.map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setThemeColor(col)}
                        className={`w-6 h-6 rounded-full border transition-transform ${
                          themeColor === col ? 'scale-125 border-white shadow-xs' : 'border-slate-800'
                        }`}
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#ffd7e5] mb-1">
                Câu nói / Trích dẫn tâm đắc (Hiển thị đầu hồ sơ)
              </label>
              <input
                type="text"
                value={favoriteQuote}
                onChange={(e) => setFavoriteQuote(e.target.value)}
                placeholder="Ví dụ: Dẫu tuyết rơi vạn dặm, lòng ta vẫn có mùa hạ..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-rose-900/60 focus:border-rose-400 focus:ring-2 focus:ring-rose-950 outline-none italic text-[#fed7e2] placeholder:text-[#a1687b]"
              />
            </div>
          </div>

          {/* 3. Short Summary with Audio Transcribe */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#ffd7e5]">
                Giới thiệu ngắn (Tóm tắt về nhân vật)
              </label>
              <AudioTranscribeButton
                label="Đọc giọng nói để ghi tóm tắt"
                onTranscribed={(text) => {
                  setSummary((prev) => (prev ? prev + ' ' + text : text));
                }}
              />
            </div>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Một vài câu tóm tắt cô đọng và thơ mộng nhất về nhân vật..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-rose-900/60 focus:border-rose-400 focus:ring-2 focus:ring-rose-950 outline-none text-[#fed7e2] placeholder:text-[#a1687b]"
            />
          </div>

          {/* 4. Detailed Story with Audio Transcribe */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#ffd7e5]">
                Cốt truyện chi tiết (Nội dung dài, tiểu sử, hồi ức)
              </label>
              <AudioTranscribeButton
                label="Kể bằng lời nói (Gemini chép lời)"
                onTranscribed={(text) => {
                  setStory((prev) => (prev ? prev + '\n\n' + text : text));
                }}
              />
            </div>
            <textarea
              rows={6}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Viết câu chuyện chi tiết về nhân vật, xuất thân, biến cố, cuộc gặp gỡ định mệnh... Hãy dùng 2 dấu xuống dòng để chia đoạn văn."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-rose-900/60 focus:border-rose-400 focus:ring-2 focus:ring-rose-950 outline-none font-serif-novel text-sm leading-relaxed text-[#fce4ec] placeholder:text-[#a1687b]"
            />
          </div>

          {/* 5. Tags Section */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-rose-900/50 space-y-3">
            <label className="block text-xs font-bold text-[#ffd7e5] uppercase tracking-wider">
              Thẻ phân loại (Tags)
            </label>

            {/* Current Tags */}
            <div className="flex flex-wrap gap-1.5 items-center">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-950 text-[#fed7e2] border border-rose-800 shadow-2xs"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-400 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Input New Tag */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    handleAddTag(newTagInput);
                  }
                }}
                placeholder="Nhập thẻ mới rồi nhấn Enter hoặc Thêm (ví dụ: Nắng_ấm, Mùa_hạ)..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-rose-900/60 focus:border-rose-400 outline-none text-xs text-[#fed7e2] placeholder:text-[#a1687b]"
              />
              <button
                type="button"
                onClick={() => handleAddTag(newTagInput)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-950 hover:bg-rose-900 text-[#fed7e2] transition-colors border border-rose-800"
              >
                Thêm thẻ
              </button>
            </div>

            {/* Quick suggested existing tags */}
            {existingTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 items-center pt-1">
                <span className="text-[11px] text-[#d89cad]">Gợi ý thẻ có sẵn:</span>
                {existingTags
                  .filter((t) => !tags.includes(t))
                  .map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleAddTag(t)}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 text-[#f8c5d6] border border-rose-900/40 transition-colors"
                    >
                      + #{t}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* 6. 📋 3 Ô LIÊN KẾT: Khoá Link + Link Gợi ý Mật khẩu (Có ô nhỏ nội dung tùy chỉnh) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-rose-900/60 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-rose-900/40 pb-2.5">
              <Lock className="w-4 h-4 text-amber-300" />
              <h3 className="text-xs font-bold text-[#ffd7e5] uppercase tracking-wider">
                Thiết lập 3 ô liên kết & Bảo mật mật khẩu
              </h3>
            </div>

            {/* Ô 1: Link gợi ý mật khẩu + Ô nhỏ nội dung tùy chỉnh nút gợi ý */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
                  <span>1. Link gợi ý mật khẩu</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-2">
                  <input
                    type="url"
                    value={passwordHintLink}
                    onChange={(e) => setPasswordHintLink(e.target.value)}
                    placeholder="https://tuyetroigiuamuaha.vn/huong-dan-pass..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-rose-900/60 focus:border-amber-400 focus:ring-2 focus:ring-amber-950 outline-none text-xs text-[#fed7e2] placeholder:text-[#a1687b]"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={passwordHintText}
                    onChange={(e) => setPasswordHintText(e.target.value)}
                    placeholder="Nội dung nút (vd: Xem gợi ý pass 🔓)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-rose-900/60 focus:border-amber-400 outline-none text-xs text-[#fed7e2] placeholder:text-[#a1687b]"
                    title="Nội dung tùy chỉnh cho nút bấm gợi ý mật khẩu"
                  />
                </div>
              </div>
              <p className="text-[11px] text-[#d89cad]">
                Gắn link vào và tùy chỉnh chữ trên nút bấm → hồ sơ sẽ hiện nút mở gợi ý tương ứng.
              </p>
            </div>

            {/* Ô 2: Mật khẩu mở link + Ô nhỏ gợi ý mật khẩu dưới ô pass */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#f472b6] flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#f472b6]" />
                  <span>2. Mật khẩu mở link</span>
                </label>
                <span className="text-[10px] font-medium text-rose-300">
                  {linkPassword.trim() ? '🔒 Đang bật khóa bảo vệ' : '🔓 Để trống = Ai cũng xem được'}
                </span>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={linkPassword}
                  onChange={(e) => setLinkPassword(e.target.value)}
                  placeholder="Nhập mật khẩu (vd: veil2007). Để trống = Không khóa..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-rose-900/60 focus:border-rose-400 focus:ring-2 focus:ring-rose-950 outline-none text-xs font-mono text-[#fed7e2] placeholder:text-[#a1687b]"
                />

                {/* Ô nhỏ tùy chỉnh dưới mục nhập mật khẩu */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#f5c2d3] mb-1">
                    Nội dung gợi ý mật khẩu hiển thị khi bị khóa (Ô nhỏ tùy chỉnh):
                  </label>
                  <input
                    type="text"
                    value={passwordCustomHint}
                    onChange={(e) => setPasswordCustomHint(e.target.value)}
                    placeholder="Ví dụ: gợi ý mật khẩu ***** hoặc tên nhân vật chính..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-rose-900/60 focus:border-rose-400 outline-none text-xs text-amber-200/90 placeholder:text-[#a1687b]"
                  />
                </div>
              </div>
            </div>

            {/* Ô 3: Link cần bảo vệ + Tên hiển thị */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#ffd7e5] mb-1 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-sky-400" />
                  <span>3. Link cần bảo vệ <span className="text-rose-400">*</span></span>
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://tuyetroigiuamuaha.vn/chuong-bi-mat hoặc link Discord..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-rose-900/60 focus:border-rose-400 focus:ring-2 focus:ring-rose-950 outline-none text-xs font-mono text-[#fed7e2] placeholder:text-[#a1687b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#ffd7e5] mb-1">
                  Tên hiển thị của Link
                </label>
                <input
                  type="text"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  placeholder="Ví dụ: Chương Ngoại Truyện VIP..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-rose-900/60 focus:border-rose-400 focus:ring-2 focus:ring-rose-950 outline-none text-xs text-[#fed7e2] placeholder:text-[#a1687b]"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-rose-900/50 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#f8c5d6] hover:bg-slate-800 transition-colors"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#b93863] via-[#c0587e] to-[#a84268] hover:from-[#a12e54] hover:to-[#913758] text-white shadow-md flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Save className="w-4 h-4" />
              <span>Lưu & Hiển thị hồ sơ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
