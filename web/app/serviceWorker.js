function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    // eslint-disable-next-line no-useless-escape
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function pushSubscription(registration) {
  return registration.pushManager.getSubscription().then(async (subscription) => {
    if (subscription) return subscription;

    const response = await fetch('/vapidPublicKey');
    const vapidPublicKey = await response.text();

    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    return registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });
  });
}

async function serverSubscription(subscription) {
  const bodyToSend = JSON.stringify({
    subscription,
  });

  const response = await fetch('/subscribe', {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
    },
    body: bodyToSend,
  });
  const textResponse = await response.text();
  console.log('serverSubscription:', textResponse);
}

function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      console.log('=======================================================');
      console.log('SW registration and subscription to push notifications.');
      console.log('=======================================================');
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('1/3 SW registered: ', registration);
        const subscription = await pushSubscription(registration);
        console.log('2/3 SW subscription: ', subscription);
        await serverSubscription(subscription);
        console.log('3/3 SW subscribed');
      } catch (error) {
        console.log('SW registration or subscription failed: ', error);
      }
      console.log('=======================================================');
    });
  }
}

function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

export { register, unregister };
