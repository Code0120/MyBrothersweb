const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

// تحميل متغيرات البيئة من .env
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ربط قاعدة البيانات
const client = new MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let messagesCollection;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// نقطة التحقق من كلمة المرور
app.post('/login', (req, res) => {
  const { name, password } = req.body;
  if (password === 'abc123') {
    res.json({ success: true, name });
  } else {
    res.status(401).json({ success: false });
  }
});

io.on('connection', (socket) => {
  console.log('🔌 مستخدم جديد متصل');

  socket.on('new message', async (data) => {
    await messagesCollection.insertOne(data);
    io.emit('new message', data);
  });
});

async function start() {
  console.log("🚀 جاري تشغيل السيرفر...");
  try {
    await client.connect();
    const db = client.db('family_chat');
    messagesCollection = db.collection('messages');
    console.log("✅ تم الاتصال بقاعدة البيانات MongoDB");

    server.listen(3000, () => {
      console.log('🚀 الخادم يعمل على http://localhost:3000');
    });
  } catch (err) {
    console.error("❌ فشل الاتصال بقاعدة البيانات:", err);
  }
}

start();
