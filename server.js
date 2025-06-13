const http = require('http');
const url = require('url');
const fs = require('fs');
const { OPENAI_API_KEY } = require('./config.json');

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // max 5 requests per window

const requests = {};

async function callAIModel(prompt) {
  const body = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }]
  };
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI error: ${response.status} ${err}`);
  }
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

function rateLimited(ip) {
  const now = Date.now();
  if (!requests[ip]) {
    requests[ip] = [];
  }
  requests[ip] = requests[ip].filter(ts => now - ts < RATE_LIMIT_WINDOW);
  if (requests[ip].length >= RATE_LIMIT_MAX) {
    return true;
  }
  requests[ip].push(now);
  return false;
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 1e6) {
        req.connection.destroy();
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'));
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const ip = req.socket.remoteAddress;

  if (['/api/ai_coach', '/api/ai_mentor'].includes(parsedUrl.pathname) && req.method === 'POST') {
    if (rateLimited(ip)) {
      res.writeHead(429, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Too many requests' }));
    }

    try {
      const { goal, progress } = await parseBody(req);
      if (!goal || !progress) {
        throw new Error('Missing goal or progress');
      }

      const prompt = `目標: ${goal}\n進度: ${progress}\n請給予建議。`;
      const reply = await callAIModel(prompt);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ reply }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
