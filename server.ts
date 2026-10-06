import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '30mb' }));

// Server-side Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Audio transcription endpoint using gemini-3.5-transcribe
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'Thiếu dữ liệu âm thanh' });
    }

    const cleanBase64 = audioBase64.replace(/^data:[^;]+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'audio/webm',
              data: cleanBase64,
            },
          },
          {
            text: 'Hãy chép lại chính xác và đầy đủ nội dung lời nói trong đoạn âm thanh này bằng tiếng Việt. Giữ đúng giọng điệu, không thêm lời chào hay giải thích.',
          },
        ],
      },
    });

    return res.json({ text: response.text || '' });
  } catch (error: any) {
    console.error('Lỗi phiên âm âm thanh:', error);
    return res.status(500).json({
      error: error?.message || 'Không thể phiên âm âm thanh từ Gemini',
    });
  }
});

// AI Writing Assistant / Lore Generator using gemini-3.8-flash
app.post('/api/gemini/generate-story', async (req, res) => {
  try {
    const { prompt, mode, characterData } = req.body;

    let systemInstruction =
      'Bạn là nhà văn và chuyên gia sáng tác trong vũ trụ tiểu thuyết "Tuyết Rơi Giữa Mùa Hạ" (Tuyết lạc thiên sơn, tình chôn vạn dặm). Văn phong thơ mộng, trữ tình, sâu lắng, đậm chất văn học ngôn tình/cổ trang hiện đại kết hợp, câu từ gãy gọn và giàu hình ảnh biểu tượng như tuyết trắng, nắng hạ, hoa lê, gió bấc, sương mai.';

    let userPrompt = prompt;

    if (mode === 'enhance_profile' && characterData) {
      userPrompt = `Hãy trau chuốt và làm phong phú hồ sơ nhân vật sau đây trong tác phẩm "Tuyết Rơi Giữa Mùa Hạ":
Tên: ${characterData.name}
Biệt danh/biểu tượng: ${characterData.subtitle || ''}
Tuổi: ${characterData.age || ''}
Thân phận: ${characterData.role || ''}
Giới thiệu hiện tại: ${characterData.summary || ''}
Cốt truyện hiện tại: ${characterData.story || ''}
Tags: ${(characterData.tags || []).join(', ')}

Hãy trả về phản hồi dưới định dạng JSON với các trường:
{
  "summary": "Đoạn giới thiệu ngắn cực kỳ lôi cuốn, 2-3 câu thơ mộng",
  "story": "Cốt truyện chi tiết giàu cảm xúc, phân đoạn rõ ràng, dài khoảng 3-5 đoạn",
  "suggestedTags": ["tag1", "tag2", "tag3"],
  "quote": "Một câu nói hoặc độc thoại đặc trưng nhất của nhân vật"
}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.85,
        ...(mode === 'enhance_profile' ? { responseMimeType: 'application/json' } : {}),
      },
    });

    return res.json({ text: response.text || '' });
  } catch (error: any) {
    console.error('Lỗi sáng tác AI:', error);
    return res.status(500).json({
      error: error?.message || 'Lỗi khi gọi mô hình Gemini',
    });
  }
});

// JSON File Database Paths
const DATA_DIR = path.join(__dirname, 'src', 'data');
const CHARACTERS_FILE = path.join(DATA_DIR, 'saved_characters.json');
const FEEDBACKS_FILE = path.join(DATA_DIR, 'saved_feedbacks.json');
const ENCOURAGEMENTS_FILE = path.join(DATA_DIR, 'saved_encouragements.json');

// Helper to read JSON
function readJSONFile(filePath: string, fallback: any) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error(`Lỗi khi đọc file ${filePath}:`, e);
  }
  return fallback;
}

// Helper to write JSON
function writeJSONFile(filePath: string, data: any) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error(`Lỗi khi ghi file ${filePath}:`, e);
  }
}

// REST API Endpoints for Auto-save and sync
app.get('/api/characters', (req, res) => {
  const chars = readJSONFile(CHARACTERS_FILE, []);
  res.json(chars);
});

app.post('/api/characters', (req, res) => {
  const chars = req.body;
  if (Array.isArray(chars)) {
    writeJSONFile(CHARACTERS_FILE, chars);
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Dữ liệu nhân vật không hợp lệ' });
  }
});

app.get('/api/feedbacks', (req, res) => {
  const feedbacks = readJSONFile(FEEDBACKS_FILE, []);
  res.json(feedbacks);
});

app.post('/api/feedbacks', (req, res) => {
  const newItem = req.body;
  if (newItem && newItem.id) {
    const feedbacks = readJSONFile(FEEDBACKS_FILE, []);
    // Remove if already exists, then add to head to prevent duplication
    const filtered = feedbacks.filter((fb: any) => fb.id !== newItem.id);
    filtered.unshift(newItem);
    writeJSONFile(FEEDBACKS_FILE, filtered);
    res.json({ success: true, item: newItem });
  } else {
    res.status(400).json({ error: 'Feedback không hợp lệ' });
  }
});

app.delete('/api/feedbacks/:id', (req, res) => {
  const { id } = req.params;
  let feedbacks = readJSONFile(FEEDBACKS_FILE, []);
  feedbacks = feedbacks.filter((fb: any) => fb.id !== id);
  writeJSONFile(FEEDBACKS_FILE, feedbacks);
  res.json({ success: true });
});

app.get('/api/encouragements', (req, res) => {
  const encouragements = readJSONFile(ENCOURAGEMENTS_FILE, []);
  res.json(encouragements);
});

app.post('/api/encouragements', (req, res) => {
  const newItem = req.body;
  if (newItem && newItem.id) {
    const encouragements = readJSONFile(ENCOURAGEMENTS_FILE, []);
    const filtered = encouragements.filter((ec: any) => ec.id !== newItem.id);
    filtered.unshift(newItem);
    writeJSONFile(ENCOURAGEMENTS_FILE, filtered);
    res.json({ success: true, item: newItem });
  } else {
    res.status(400).json({ error: 'Lời động viên không hợp lệ' });
  }
});

app.delete('/api/encouragements/:id', (req, res) => {
  const { id } = req.params;
  let encouragements = readJSONFile(ENCOURAGEMENTS_FILE, []);
  encouragements = encouragements.filter((ec: any) => ec.id !== id);
  writeJSONFile(ENCOURAGEMENTS_FILE, encouragements);
  res.json({ success: true });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server Tuyết Rơi Giữa Mùa Hạ đang chạy tại http://localhost:${port}`);
  });
}

startServer();
