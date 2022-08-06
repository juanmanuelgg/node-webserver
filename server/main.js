const express = require('express');
const path = require('path');
const webpush = require('web-push');

require('dotenv').config();

const PORT = 9012;

const subscriptionsMap = new Map();

const app = express();
app.use(express.json());

// Key creation: console.log(webpush.generateVAPIDKeys());
webpush.setVapidDetails(
  `http://localhost:${PORT}/`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/vapidPublicKey', (req, res) => {
  res.send(process.env.VAPID_PUBLIC_KEY);
});

app.post('/subscribe', (req, res) => {
  const { subscription } = req.body;
  subscriptionsMap.put(JSON.stringify(subscription), subscription);
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
  res.sendFile(path.resolve(__dirname, 'public', 'service-worker.js'));
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, console.log(`App on http://localhost:${PORT}`));
// https://create-react-app.dev/docs/deployment/
