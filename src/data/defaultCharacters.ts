import { Character } from '../types/character';

export const DEFAULT_CHARACTERS: Character[] = [
  {
    id: 'char-ha-an',
    name: 'Hạ An',
    subtitle: 'Nắng ấm',
    age: '19 tuổi',
    gender: 'Nữ',
    role: 'Thiếu nữ ánh dương • Khúc ca đầu hạ',
    story: `Hạ An sinh ra vào ngày hạ chí nắng đẹp nhất năm, khi những cánh hoa phượng đỏ rực khắp mọi góc phố. Trái tim nàng ngập tràn niềm lạc quan và sự nồng ấm thuần khiết. Thế nhưng định mệnh lại đưa nàng đến vùng chân núi Thiên Sơn — nơi quanh năm chỉ có gió buốt và tuyết trắng phủ ngập sườn đồi.

Người đời bảo rằng, người của mùa hạ không thể nào bước chân vào xứ tuyết, bởi băng giá sẽ dập tắt hơi ấm sinh mệnh. Thế nhưng Hạ An vẫn mang theo chiếc áo choàng len đỏ và chiếc đèn lồng ấm áp băng qua thung lũng lạnh giá. Nàng muốn tìm kiếm bông hoa tuyết nghìn năm chỉ nở giữa đỉnh băng phong, để chứng minh rằng ngay cả giữa mùa hạ oi ả, tuyết trắng vẫn có thể rơi xuống dịu dàng như một lời hẹn ước.

"Nếu mùa hạ không có tuyết, vậy ta sẽ mang cả bầu trời nắng ấm đến để sưởi ấm cho từng bông tuyết nơi chàng đứng."`,
    tags: ['Nắng_ấm', 'Tươi_sáng', 'Mùa_hạ'],
    passwordHintLink: '',
    passwordHintText: '',
    linkPassword: '', // Để trống = không khóa, ai cũng xem được
    passwordCustomHint: '',
    linkUrl: 'https://tuyetroigiuamuaha.vn/ha-an',
    linkTitle: 'Chương truyện: Tiếng Chuông Gió Tháng Sáu',
    avatarIcon: '☀️',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    themeColor: '#f59e0b',
    favoriteQuote: 'Dẫu tuyết rơi vạn dặm, trong lòng ta vẫn có một mùa hạ không bao giờ tàn úa.',
    createdAt: 1717000000000,
    updatedAt: 1717000000000,
  },
  {
    id: 'char-bang-nhi',
    name: 'Băng Nhi',
    subtitle: 'Giọt tuyết',
    age: '18 tuổi',
    gender: 'Nữ',
    role: 'Tuyết tinh linh • Ẩn sĩ băng hồ',
    story: `Băng Nhi vốn là giọt linh vũ ngưng kết trên đỉnh Thiên Sơn qua trăm ngàn mùa đông cô tịch. Nàng thức tỉnh với hình hài một thiếu nữ áo trắng, không ký ức, không chốn đi về, chỉ có tiếng gió rít qua hẻm núi làm bạn tri âm.

Nàng sợ ánh mặt trời, vì hơi ấm có thể khiến linh thể nàng dần tan biến thành sương khói mờ ảo. Nhưng định mệnh trớ trêu khi vào một ngày giữa tháng bảy oi nồng, tuyết đột ngột rơi trắng xóa khắp vùng đồng bằng phía nam. Nàng nhìn thấy bóng dáng ai đó kiên cường bước ngược chiều gió bão, tay cầm một nhành hoa thơm ngát muốn dâng tặng bông tuyết đầu mùa.

Giọt nước mắt của Băng Nhi rơi xuống lớp băng mỏng, hóa thành viên ngọc băng sáng lấp lánh giữa đêm hè: "Ta ngỡ mình là kẻ thuộc về vĩnh cửu của giá lạnh, cho đến khi người dạy ta biết rằng, tan biến vì một lần được yêu... cũng là một loại hạnh phúc trọn vẹn."`,
    tags: ['Tuyết', 'Bí_ẩn', 'Dịu_dàng'],
    passwordHintLink: '',
    passwordHintText: '',
    linkPassword: '', // Không khóa
    passwordCustomHint: '',
    linkUrl: 'https://tuyetroigiuamuaha.vn/bang-nhi',
    linkTitle: 'Bản Nhạc: Khúc Tương Tư Dưới Đáy Băng Hồ',
    avatarIcon: '❄️',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    themeColor: '#38bdf8',
    favoriteQuote: 'Tuyết rơi không vì muốn làm lạnh thế gian, mà là để ôm lấy những nỗi đau chưa từng được nói.',
    createdAt: 1717001000000,
    updatedAt: 1717001000000,
  },
  {
    id: 'char-tran-minh-khanh',
    name: 'Trần Minh Khánh',
    subtitle: 'VEIL • Đàn em khóa dưới',
    age: '18 tuổi',
    gender: 'Nam',
    role: 'Tân sinh viên Tài chính • Streamer màn đêm bí ẩn',
    story: `Ở trường đại học, ai cũng biết đến Trần Minh Khánh — cậu sinh viên năm nhất nhiệt huyết của Ban Truyền thông. Cậu luôn chạy bộ từ tầng này sang tầng khác chỉ để đưa bản thảo tận tay cho đàn anh, đàn chị, miệng luôn cười tươi rói và xưng hô ngoan ngoãn.

Thế nhưng khi đồng hồ điểm 11 giờ đêm tại căn phòng trọ nhỏ khuất sâu trong ngõ Hà Nội, chiếc kính gọng vuông được tháo xuống. Đèn LED đỏ thẫm bật sáng, mặt nạ đen che kín từ sống mũi. VEIL xuất hiện trước micro cổ điển, chất giọng khàn đặc, chậm rãi rót từng câu từ quyến rũ vào màn đêm.

Khánh duy trì hai thân phận song song gần một năm mà chưa từng lộ sơ hở. Cho đến khi cậu bắt đầu nhận thấy bóng hình của vị đàn anh/chị khóa trên mà cậu ngưỡng mộ ở trường trùng khớp kỳ lạ với người thính giả top donor mang tên "void.passenger"...`,
    tags: ['Bí_ẩn', 'Hai_mặt', 'Mùa_hạ', 'Học_viện', 'VEIL', 'R18'],
    passwordHintLink: 'https://discord.gg/veil-and-the-nightowls',
    passwordHintText: 'Xem gợi ý pass Discord 🔓',
    linkPassword: 'veil', // Mật khẩu mẫu: "veil"
    passwordCustomHint: 'Gợi ý mật khẩu: tên biệt danh stream viết thường (v _ i _ l)',
    linkUrl: 'https://discord.gg/veil-and-the-nightowls-secret-room',
    linkTitle: 'Phòng Kín Discord: VEIL & THE NIGHTOWLS (18+)',
    avatarIcon: '🎭',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    themeColor: '#ec4899',
    favoriteQuote: 'Em muốn thấy em... Không phải một trong hai nhân cách, mà là cả hai.',
    createdAt: 1717002000000,
    updatedAt: 1717002000000,
  },
];
