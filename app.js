const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/router');
const cors = require('cors');
const multer = require('multer');

const app = express();

// Middleware для разбора JSON
app.use(bodyParser.json());

// Настройка CORS
app.use(cors()); // Переместите эту строку здесь

// Подключение маршрутов
app.use(router);

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Что-то сломалось!');
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  res.send('Файл успешно загружен');
});

app.get('/api/uploads', (req, res) => {
  fs.readdir('uploads/', (err, files) => {
    if (err) {
      res.send('Ошибка при получении списка файлов');
      return;
    }
    res.json(files);
  });
});

// Запуск сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

module.exports = app;
