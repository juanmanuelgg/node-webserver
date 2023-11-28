const ignored = self.__WB_MANIFEST;

async function informClients(message) {
  await self.clients.claim();
  const clients = await self.clients.matchAll();
  clients.forEach((client) => {
    client.postMessage({ command: "alert", message });
  });
}

function processPushEvent(event) {
  const pushbody = event.data ? event.data.text() : "Push message no payload";

  const options = {
    body: pushbody,
    icon: "favicon_x48.ico",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: "2",
    },
    actions: [
      {
        action: "explore",
        title: "Ver Notificación",
        icon: "favicon_x48.ico",
      },
      { action: "close", title: "Close", icon: "logo512.png" },
    ],
  };

  event.waitUntil(
    self.registration.showNotification("Notification title", options),
  );
}

function processNotificationclickEvent(event) {
  const { notification, action } = event;
  const { primaryKey, dateOfArrival } = notification.data;
  // if (action === 'close')
  // if (action === 'explore')
  console.log("notificationclick", { action, primaryKey, dateOfArrival });
  notification.close();
}

self.addEventListener("push", (event) => {
  processPushEvent(event);
});
self.addEventListener("notificationclick", (event) => {
  processNotificationclickEvent(event);
});
