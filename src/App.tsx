import React, { useState, useEffect, useMemo } from 'react';
import { Character, ViewMode, FeedbackItem, EncouragementItem } from './types/character';
import { DEFAULT_CHARACTERS } from './data/defaultCharacters';
import { SnowEffect } from './components/SnowEffect';
import { Header } from './components/Header';
import { TagFilter } from './components/TagFilter';
import { CharacterCard } from './components/CharacterCard';
import { CharacterDetail } from './components/CharacterDetail';
import { CharacterModal } from './components/CharacterModal';
import { FeedbackSubmit } from './components/FeedbackSubmit';
import { FeedbackView } from './components/FeedbackView';
import { EncouragementSubmit } from './components/EncouragementSubmit';
import { NSFWWarningModal } from './components/NSFWWarningModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import {
  Snowflake,
  Sparkles,
  Plus,
  BookOpen,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'tuyet_roi_giua_mua_ha_characters_v2';
const SNOW_SETTINGS_KEY = 'tuyet_roi_giua_mua_ha_snow_settings';
const FEEDBACKS_STORAGE_KEY = 'tuyet_roi_giua_mua_ha_feedbacks_v1';
const ENCOURAGEMENTS_STORAGE_KEY = 'tuyet_roi_giua_mua_ha_encouragements_v1';

// Helper to check if a character or tag is R18 / NSFW
const isR18 = (characterOrTag: Character | string): boolean => {
  if (typeof characterOrTag === 'string') {
    const clean = characterOrTag.replace(/^#/, '').toLowerCase().trim();
    return clean === 'r18' || clean === '18+' || clean === 'nsfw';
  } else {
    return (characterOrTag.tags || []).some((t) => {
      const clean = t.replace(/^#/, '').toLowerCase().trim();
      return clean === 'r18' || clean === '18+' || clean === 'nsfw';
    });
  }
};

export default function App() {
  // Manage dark/light theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('tuyet_roi_giua_mua_ha_theme');
      return stored !== 'light'; // Default to true (dark)
    } catch (e) {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tuyet_roi_giua_mua_ha_theme', isDarkMode ? 'dark' : 'light');
    } catch (e) {}

    const root = document.documentElement;
    const body = document.body;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.add('dark');
      body.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      body.classList.add('light');
      body.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sync with Server-Side Database on Mount
  useEffect(() => {
    const syncWithServer = async () => {
      try {
        // 1. Sync Characters
        const charRes = await fetch('/api/characters');
        if (charRes.ok) {
          const serverChars = await charRes.json();
          if (Array.isArray(serverChars) && serverChars.length > 0) {
            setCharacters(serverChars);
          } else {
            // Seeding server if server-side file is empty
            await fetch('/api/characters', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(characters),
            });
          }
        }

        // 2. Sync Feedbacks
        const fbRes = await fetch('/api/feedbacks');
        if (fbRes.ok) {
          const serverFeedbacks = await fbRes.json();
          if (Array.isArray(serverFeedbacks)) {
            setFeedbacks(serverFeedbacks);
          }
        }

        // 3. Sync Encouragements
        const ecRes = await fetch('/api/encouragements');
        if (ecRes.ok) {
          const serverEncouragements = await ecRes.json();
          if (Array.isArray(serverEncouragements)) {
            setEncouragements(serverEncouragements);
          }
        }
      } catch (err) {
        console.warn('Không thể kết nối đến máy chủ để đồng bộ dữ liệu. Đang hoạt động ở chế độ ngoại tuyến (Offline Mode).', err);
      }
    };

    syncWithServer();
  }, []);

  // Characters State with LocalStorage persistence
  const [characters, setCharacters] = useState<Character[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Lỗi khi đọc từ localStorage:', e);
    }
    return DEFAULT_CHARACTERS;
  });

  // Save to localStorage whenever characters change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(characters));
    } catch (e) {
      console.error('Lỗi khi lưu vào localStorage:', e);
    }
  }, [characters]);

  // Feedbacks State with LocalStorage persistence
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(() => {
    try {
      const stored = localStorage.getItem(FEEDBACKS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Lỗi khi đọc feedback từ localStorage:', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(FEEDBACKS_STORAGE_KEY, JSON.stringify(feedbacks));
    } catch (e) {
      console.error('Lỗi khi lưu feedback vào localStorage:', e);
    }
  }, [feedbacks]);

  // Encouragements State with LocalStorage persistence
  const [encouragements, setEncouragements] = useState<EncouragementItem[]>(() => {
    try {
      const stored = localStorage.getItem(ENCOURAGEMENTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Lỗi khi đọc lời động viên từ localStorage:', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(ENCOURAGEMENTS_STORAGE_KEY, JSON.stringify(encouragements));
    } catch (e) {
      console.error('Lỗi khi lưu lời động viên vào localStorage:', e);
    }
  }, [encouragements]);

  // Favorites State with LocalStorage persistence
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('tuyet_roi_giua_mua_ha_favorites_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Lỗi khi đọc danh sách yêu thích:', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('tuyet_roi_giua_mua_ha_favorites_v1', JSON.stringify(favoriteIds));
    } catch (e) {
      console.error('Lỗi khi lưu danh sách yêu thích:', e);
    }
  }, [favoriteIds]);

  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);

  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('tuyet_roi_giua_mua_ha_welcome_seen') !== 'true';
    } catch (e) {
      return true;
    }
  });

  const handleDismissWelcome = () => {
    try {
      sessionStorage.setItem('tuyet_roi_giua_mua_ha_welcome_seen', 'true');
    } catch (e) {}
    setShowWelcome(false);
  };

  // View state: 'grid' | 'detail' | 'feedback-submit' | 'feedback-view' | 'encouragement-submit'
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

  // Filter & Search states
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal states
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState<boolean>(false);
  const [characterToEdit, setCharacterToEdit] = useState<Character | null>(null);

  // Delete confirmation dialog
  const [characterToDelete, setCharacterToDelete] = useState<{ id: string; name: string } | null>(null);

  // NSFW / R18 Age Verification Modal states
  const [isNSFWModalOpen, setIsNSFWModalOpen] = useState<boolean>(false);
  const [nsfwTargetTitle, setNsfwTargetTitle] = useState<string>('');
  const [pendingR18Action, setPendingR18Action] = useState<(() => void) | null>(null);

  // Snow effect settings
  const [snowEnabled, setSnowEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(SNOW_SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.enabled ?? true;
      }
    } catch (e) {}
    return true;
  });

  const [snowType, setSnowType] = useState<'snow' | 'crystal' | 'sakura'>('snow');

  const toggleSnow = () => {
    setSnowEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SNOW_SETTINGS_KEY, JSON.stringify({ enabled: next, type: snowType }));
      } catch (e) {}
      return next;
    });
  };

  const toggleSnowType = () => {
    setSnowType((prev) => {
      const next = prev === 'snow' ? 'crystal' : prev === 'crystal' ? 'sakura' : 'snow';
      try {
        localStorage.setItem(SNOW_SETTINGS_KEY, JSON.stringify({ enabled: snowEnabled, type: next }));
      } catch (e) {}
      return next;
    });
  };

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Selected character computed
  const selectedCharacter = useMemo(() => {
    return characters.find((c) => c.id === selectedCharacterId) || null;
  }, [characters, selectedCharacterId]);

  // Extract all unique tags and their counts
  const availableTags = useMemo(() => {
    const counts: Record<string, number> = {};
    characters.forEach((char) => {
      char.tags.forEach((t) => {
        const cleanTag = t.trim();
        if (cleanTag) {
          counts[cleanTag] = (counts[cleanTag] || 0) + 1;
        }
      });
    });

    return Object.entries(counts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [characters]);

  // Filtered characters based on search, selected tag, and favorites
  const filteredCharacters = useMemo(() => {
    return characters.filter((char) => {
      // Favorite filter
      if (showFavoritesOnly && !favoriteIds.includes(char.id)) {
        return false;
      }

      // Tag filter
      if (selectedTag && !char.tags.includes(selectedTag)) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = char.name.toLowerCase().includes(q);
        const matchesSubtitle = (char.subtitle || '').toLowerCase().includes(q);
        const matchesSummary = (char.summary || '').toLowerCase().includes(q);
        const matchesStory = (char.story || '').toLowerCase().includes(q);
        const matchesLinkTitle = (char.linkTitle || '').toLowerCase().includes(q);
        const matchesTags = char.tags.some((t) => t.toLowerCase().includes(q));

        return (
          matchesName ||
          matchesSubtitle ||
          matchesSummary ||
          matchesStory ||
          matchesLinkTitle ||
          matchesTags
        );
      }

      return true;
    });
  }, [characters, selectedTag, searchQuery, showFavoritesOnly, favoriteIds]);

  // NSFW Modal Handlers
  const triggerNSFWCheck = (title: string, action: () => void) => {
    setNsfwTargetTitle(title);
    setPendingR18Action(() => action);
    setIsNSFWModalOpen(true);
  };

  const handleAcceptNSFW = () => {
    setIsNSFWModalOpen(false);
    if (pendingR18Action) {
      pendingR18Action();
      setPendingR18Action(null);
    }
  };

  const handleDeclineNSFW = () => {
    setIsNSFWModalOpen(false);
    setPendingR18Action(null);
  };

  // Navigation handlers with R18 Intercept
  const handleSelectCharacter = (character: Character) => {
    if (isR18(character)) {
      triggerNSFWCheck(`Hồ sơ nhân vật "${character.name}" (có gắn tag #R18)`, () => {
        setSelectedCharacterId(character.id);
        setViewMode('detail');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      return;
    }

    setSelectedCharacterId(character.id);
    setViewMode('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTag = (tag: string | null) => {
    if (tag && isR18(tag)) {
      triggerNSFWCheck(`Thẻ phân loại #${tag}`, () => {
        setSelectedTag(tag);
        setViewMode('grid');
      });
      return;
    }

    setSelectedTag(tag);
  };

  const handleBackToList = () => {
    setViewMode('grid');
    setSelectedCharacterId(null);
  };

  // Add / Edit Character
  const handleOpenCreateModal = () => {
    setCharacterToEdit(null);
    setIsCharacterModalOpen(true);
  };

  const handleOpenEditModal = (char: Character) => {
    setCharacterToEdit(char);
    setIsCharacterModalOpen(true);
  };

  const handleSaveCharacter = async (savedChar: Character) => {
    let updatedList: Character[] = [];
    setCharacters((prev) => {
      const exists = prev.some((c) => c.id === savedChar.id);
      if (exists) {
        updatedList = prev.map((c) => (c.id === savedChar.id ? savedChar : c));
      } else {
        updatedList = [savedChar, ...prev];
      }
      return updatedList;
    });

    setIsCharacterModalOpen(false);
    showToast(`Đã lưu hồ sơ nhân vật "${savedChar.name}" thành công!`);

    // Async server-side save
    try {
      await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedList),
      });
    } catch (e) {
      console.error('Lỗi tự động lưu nhân vật lên máy chủ:', e);
    }
  };

  // Delete Character
  const handleDeletePrompt = (id: string, name: string) => {
    setCharacterToDelete({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!characterToDelete) return;
    const { id, name } = characterToDelete;

    let updatedList: Character[] = [];
    setCharacters((prev) => {
      updatedList = prev.filter((c) => c.id !== id);
      return updatedList;
    });
    setCharacterToDelete(null);

    if (selectedCharacterId === id) {
      setViewMode('grid');
      setSelectedCharacterId(null);
    }

    showToast(`Đã xóa hồ sơ "${name}"`);

    // Async server-side save after deletion
    try {
      await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedList),
      });
    } catch (e) {
      console.error('Lỗi tự động lưu nhân vật sau khi xóa lên máy chủ:', e);
    }
  };

  // Favorite Handlers
  const handleToggleFavorite = (id: string, name: string) => {
    setFavoriteIds((prev) => {
      const isFav = prev.includes(id);
      if (isFav) {
        showToast(`Đã bỏ yêu thích nhân vật "${name}" 💔`);
        return prev.filter((favId) => favId !== id);
      } else {
        showToast(`Đã thêm nhân vật "${name}" vào danh sách Yêu thích! ❤️`);
        return [...prev, id];
      }
    });
  };

  // Feedback Handlers
  const handleSaveFeedback = async (newItem: FeedbackItem) => {
    setFeedbacks((prev) => [newItem, ...prev]);

    // Async server-side save
    try {
      await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
    } catch (e) {
      console.error('Lỗi tự động lưu feedback lên máy chủ:', e);
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    setFeedbacks((prev) => prev.filter((fb) => fb.id !== id));
    showToast('Đã xóa feedback thành công!');

    // Async server-side delete
    try {
      await fetch(`/api/feedbacks/${id}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.error('Lỗi xóa feedback trên máy chủ:', e);
    }
  };

  // Encouragement Handlers
  const handleSaveEncouragement = async (newItem: EncouragementItem) => {
    setEncouragements((prev) => [newItem, ...prev]);

    // Async server-side save
    try {
      await fetch('/api/encouragements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
    } catch (e) {
      console.error('Lỗi tự động lưu lời động viên lên máy chủ:', e);
    }
  };

  const handleDeleteEncouragement = async (id: string) => {
    setEncouragements((prev) => prev.filter((ec) => ec.id !== id));
    showToast('Đã xóa lời động viên gửi đến Hạ!');

    // Async server-side delete
    try {
      await fetch(`/api/encouragements/${id}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.error('Lỗi xóa lời động viên trên máy chủ:', e);
    }
  };

  // Reset to default sample characters
  const handleResetToDefaults = async () => {
    if (window.confirm('Khôi phục danh sách nhân vật mẫu ban đầu (Hạ An, Băng Nhi, Trần Minh Khánh)?')) {
      setCharacters(DEFAULT_CHARACTERS);
      setSelectedTag(null);
      setSearchQuery('');
      setViewMode('grid');
      showToast('Đã khôi phục dữ liệu mẫu ban đầu thành công!');

      // Sync server-side reset
      try {
        await fetch('/api/characters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(DEFAULT_CHARACTERS),
        });
      } catch (e) {
        console.error('Lỗi đồng bộ đặt lại dữ liệu mẫu lên máy chủ:', e);
      }
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-rose-900/60 selection:text-pink-100">
      {/* Immersive Welcome Screen Overlay */}
      {showWelcome && (
        <WelcomeScreen onDismiss={handleDismissWelcome} />
      )}

      {/* Falling Snow / Sakura Particle Canvas with Dark Mode Aura */}
      <SnowEffect enabled={snowEnabled} type={snowType} darkMode={isDarkMode} />

      {/* Main Top Header */}
      <Header
        snowEnabled={snowEnabled}
        onToggleSnow={toggleSnow}
        snowType={snowType}
        onToggleSnowType={toggleSnowType}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCreateModal={handleOpenCreateModal}
        totalCharacters={characters.length}
        totalTags={availableTags.length}
        onNavigate={setViewMode}
        feedbacksCount={feedbacks.length + encouragements.length}
        viewMode={viewMode}
        onResetDefaults={handleResetToDefaults}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {viewMode === 'detail' && selectedCharacter ? (
          /* Detailed Profile View */
          <CharacterDetail
            character={selectedCharacter}
            onBack={handleBackToList}
            onEdit={handleOpenEditModal}
            onDelete={handleDeletePrompt}
            isFavorite={favoriteIds.includes(selectedCharacter.id)}
            onToggleFavorite={handleToggleFavorite}
            onSelectTag={(tag) => {
              handleSelectTag(tag);
              if (!isR18(tag)) {
                handleBackToList();
              }
            }}
          />
        ) : viewMode === 'feedback-submit' ? (
          /* Feedback Submit View */
          <FeedbackSubmit
            characters={characters}
            feedbacks={feedbacks}
            onSaveFeedback={handleSaveFeedback}
            onNavigate={setViewMode}
            showToast={showToast}
          />
        ) : viewMode === 'encouragement-submit' ? (
          /* Encouragement Submit View */
          <EncouragementSubmit
            encouragements={encouragements}
            onSaveEncouragement={handleSaveEncouragement}
            onNavigate={setViewMode}
            showToast={showToast}
          />
        ) : viewMode === 'feedback-view' ? (
          /* Feedback View List (with split tabs) */
          <FeedbackView
            characters={characters}
            feedbacks={feedbacks}
            encouragements={encouragements}
            onNavigate={setViewMode}
            onDeleteFeedback={handleDeleteFeedback}
            onDeleteEncouragement={handleDeleteEncouragement}
          />
        ) : (
          /* Grid List View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tag Filter Bar */}
            <TagFilter
              availableTags={availableTags}
              selectedTag={selectedTag}
              onSelectTag={handleSelectTag}
              totalCount={characters.length}
              showFavoritesOnly={showFavoritesOnly}
              onToggleShowFavorites={setShowFavoritesOnly}
              favoritesCount={favoriteIds.length}
            />

            {/* Status & Active Filter Indicator */}
            {(selectedTag || searchQuery || showFavoritesOnly) && (
              <div className="flex items-center justify-between gap-3 mb-6 p-3 rounded-2xl bg-slate-900/90 border border-rose-900/50 text-xs text-[#f8c5d6] shadow-xs backdrop-blur-md transition-colors font-medium">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#f472b6]" />
                  <span>
                    Hiển thị <strong>{filteredCharacters.length}</strong> nhân vật
                    {showFavoritesOnly ? ' trong danh sách Yêu thích ❤️' : ''}
                    {selectedTag ? ` có thẻ #${selectedTag}` : ''}
                    {searchQuery ? ` khớp với từ khóa "${searchQuery}"` : ''}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedTag(null);
                    setSearchQuery('');
                    setShowFavoritesOnly(false);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#fbcfe8] hover:text-white bg-slate-800 hover:bg-slate-750 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}

            {/* Character Cards Grid */}
            {filteredCharacters.length === 0 ? (
              <div className="glass-panel rounded-3xl p-12 text-center border border-rose-900/50 space-y-3 mt-4">
                <div className="w-16 h-16 rounded-full bg-rose-950/80 text-[#f472b6] flex items-center justify-center mx-auto border border-rose-900">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="font-serif-novel text-lg font-bold text-[#ffdce7]">
                  {showFavoritesOnly ? 'Chưa có nhân vật yêu thích nào' : 'Không tìm thấy nhân vật phù hợp'}
                </h3>
                <p className="text-xs text-[#d89cad] max-w-sm mx-auto">
                  {showFavoritesOnly
                    ? 'Hãy thả tim ❤️ lên thẻ hồ sơ của nhân vật bạn thích để đưa họ vào danh sách riêng biệt này nhé!'
                    : 'Không có nhân vật nào khớp với từ khóa hoặc thẻ phân loại bạn chọn. Hãy thử tìm kiếm với từ khóa khác nhé.'}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedTag(null);
                      setSearchQuery('');
                      setShowFavoritesOnly(false);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#842244] text-white hover:bg-[#9c2b53] transition-colors"
                  >
                    Xem tất cả nhân vật
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCharacters.map((character) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    onSelect={handleSelectCharacter}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDeletePrompt}
                    onSelectTag={handleSelectTag}
                    selectedTag={selectedTag}
                    isFavorite={favoriteIds.includes(character.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-900/50 py-6 px-4 bg-slate-950/80 backdrop-blur-md text-center text-xs text-[#d89cad]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif-novel font-bold text-[#ffdce7]">Tuyết Rơi Giữa Mùa Hạ</span>
            <span>•</span>
            <span>Kho tàng hồ sơ nhân vật & truyện dài</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetToDefaults}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#f8c5d6] border border-purple-900/50 transition-colors font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Khôi phục dữ liệu mẫu</span>
            </button>
            <span className="text-purple-900">|</span>
            <span className="font-medium text-purple-300/80">Hỗ trợ phiên âm giọng nói & Feedback ẩn danh</span>
          </div>
        </div>
      </footer>

      {/* Add / Edit Character Modal */}
      <CharacterModal
        isOpen={isCharacterModalOpen}
        characterToEdit={characterToEdit}
        onClose={() => setIsCharacterModalOpen(false)}
        onSave={handleSaveCharacter}
        existingTags={availableTags.map((t) => t.tag)}
      />

      {/* NSFW 18+ Warning Modal */}
      <NSFWWarningModal
        isOpen={isNSFWModalOpen}
        targetName={nsfwTargetTitle}
        onAccept={handleAcceptNSFW}
        onDecline={handleDeclineNSFW}
      />

      {/* Delete Confirmation Dialog */}
      {characterToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-slate-900 rounded-3xl p-6 shadow-2xl border border-purple-900/70 text-center animate-in zoom-in-95 duration-200 text-[#f9ccd9]">
            <div className="w-12 h-12 rounded-full bg-purple-950/80 text-pink-400 flex items-center justify-center mx-auto mb-3 border border-purple-900">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-serif-novel text-lg font-bold text-[#ffdce7] mb-1">
              Xác nhận xóa hồ sơ?
            </h3>
            <p className="text-xs text-[#d89cad] mb-6 font-medium">
              Bạn có chắc chắn muốn xóa hồ sơ nhân vật{' '}
              <strong className="text-[#fed7e2]">"{characterToDelete.name}"</strong> không? Thao tác này không thể hoàn tác.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => setCharacterToDelete(null)}
                className="flex-1 px-4 py-2 rounded-xl text-xs font-bold text-[#f8c5d6] bg-slate-800 hover:bg-slate-750 transition-colors border border-purple-900/40"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-900 hover:bg-purple-800 transition-colors shadow-xs border border-purple-700/50"
              >
                Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-950/95 text-[#ffdce7] text-xs font-bold shadow-xl backdrop-blur-md border border-purple-700/50 animate-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
