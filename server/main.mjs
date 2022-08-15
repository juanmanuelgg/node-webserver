import dotenv from 'dotenv';
import express, { json, static as staticFiles } from 'express';
import rateLimit from 'express-rate-limit';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import webpush from 'web-push';

dotenv.config();

const PORT = 9012;

const subscriptionsMap = new Map();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();
app.use(json());
// Apply the rate limiting middleware to all requests
app.use(limiter);

// Key creation: console.log(webpush.generateVAPIDKeys());
webpush.setVapidDetails(
  `http://localhost:${PORT}/`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(staticFiles(join(__dirname, 'public')));

app.get('/vapidPublicKey', (req, res) => {
  res.send(process.env.VAPID_PUBLIC_KEY);
});

app.post('/subscribe', (req, res) => {
  const { subscription } = req.body;
  subscriptionsMap.set(JSON.stringify(subscription), subscription);
  console.log('/subscribe, # clientes:', subscriptionsMap.size);
  res.sendStatus(201);
});

app.get('/push/:message', async (req, res) => {
  const { message } = req.params;
  const payload = JSON.stringify({ data: message }); //  Payload must be either a string or a Node Buffer.
  const options = { TTL: 5 };

  let bienTodo = true;
  for (const subscription of subscriptionsMap.values()) {
    try {
      await webpush.sendNotification(subscription, payload, options);
    } catch (error) {
      bienTodo = false;
      console.error(error);
    }
  } // rof
  res.sendStatus(bienTodo ? 200 : 500);
});

// This 2 must be the last ones
app.get('/service-worker.js', (req, res) => {
  res.sendFile(resolve(__dirname, 'public', 'service-worker.js'));
});

app.get('/*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, console.log(`App on http://localhost:${PORT}`));
// https://create-react-app.dev/docs/deployment/
