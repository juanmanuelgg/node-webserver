const ignored=self.__WB_MANIFEST;async function informClients(i){await self.clients.claim(),(await self.clients.matchAll()).forEach((t=>{t.postMessage({command:"alert",message:i})}))}function processPushEvent(i){const t={body:i.data?i.data.text():"Push message no payload",icon:"favicon_x48.ico",vibrate:[100,50,100],data:{dateOfArrival:Date.now(),primaryKey:"2"},actions:[{action:"explore",title:"Ver Notificación",icon:"favicon_x48.ico"},{action:"close",title:"Close",icon:"logo512.png"}]};i.waitUntil(self.registration.showNotification("Notification title",t))}function processNotificationclickEvent(i){const{notification:t,action:o}=i,{primaryKey:a,dateOfArrival:e}=t.data;console.log("notificationclick",{action:o,primaryKey:a,dateOfArrival:e}),t.close()}self.addEventListener("push",(i=>{processPushEvent(i)})),self.addEventListener("notificationclick",(i=>{processNotificationclickEvent(i)}));