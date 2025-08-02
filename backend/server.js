const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

const urlStore = {};

const logMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[LOG ${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
};

app.use(logMiddleware);
app.post('/api/shorten', (req, res) => {
  const { originalUrl, expiry = 30, customCode } = req.body;

  let shortCode = customCode || uuidv4().slice(0, 6);
  if (urlStore[shortCode]) return res.status(400).json({ error: 'Shortcode exists' });

  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + expiry * 60000);
  urlStore[shortCode] = {
    originalUrl,
    shortCode,
    createdAt,
    expiresAt,
    clicks: [],
  };

  res.json(urlStore[shortCode]);
});


app.get('/api/resolve/:shortCode', (req, res) => {
  const { shortCode } = req.params;
  const record = urlStore[shortCode];

  if (!record) return res.status(404).json({ error: 'Shortcode not found' });

  
  record.clicks.push({
    timestamp: new Date(),
    source: req.headers['user-agent'],
    location: "India"
  });

  res.json({ originalUrl: record.originalUrl });
});
app.get('/api/statistics', (req, res) => {
  res.json(Object.values(urlStore));
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

