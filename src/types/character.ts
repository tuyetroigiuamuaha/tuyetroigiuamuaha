export interface Character {
  id: string;
  name: string;
  subtitle: string; // e.g. "Nắng ấm", "Giọt tuyết"
  age?: string;
  gender?: string;
  role?: string;
  summary?: string; // Giới thiệu ngắn
  story: string; // Cốt truyện chi tiết
  tags: string[]; // Thẻ phân loại

  // 3 ô liên kết & bảo mật:
  passwordHintLink?: string;  // 1. Link gợi ý mật khẩu
  passwordHintText?: string;  // Nội dung tùy chỉnh cho nút gợi ý
  linkPassword?: string;      // 2. Mật khẩu mở link
  passwordCustomHint?: string; // Nội dung gợi ý mật khẩu tùy chỉnh (vd: gợi ý pass *****)
  linkUrl: string;            // 3. Link cần bảo vệ
  linkTitle?: string;         // Tên hiển thị của link (tùy chọn)

  avatarUrl?: string; // Ảnh hoặc biểu tượng
  avatarIcon?: string; // Emoji hoặc preset icon: ❄️, ☀️, 🌸, 🌙, 🕊️, 🎭, 🎋
  themeColor?: string; // Màu chủ đạo của nhân vật
  favoriteQuote?: string; // Câu thoại kinh điển
  createdAt: number;
  updatedAt: number;

  // Dữ liệu cũ (nếu có):
  personality?: string;
  hobbies?: string;
  traits?: string;
}

export interface FeedbackItem {
  id: string;
  characterName: string;
  senderNickname?: string; // Biệt danh của bạn (kèm xúc xắc ngẫu nhiên)
  content: string;
  imageUrl?: string;
  createdAt: number;
}

export interface EncouragementItem {
  id: string;
  senderNickname: string;
  message: string;
  createdAt: number;
}

export type ViewMode = 'grid' | 'detail' | 'feedback-submit' | 'feedback-view' | 'encouragement-submit';
