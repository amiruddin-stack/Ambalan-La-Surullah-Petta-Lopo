const admin = require('firebase-admin');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');

admin.initializeApp();
const db = admin.firestore();
const messaging = admin.messaging();

async function sendToMembers({ title, body, target, excludeUid, eventId }) {
  const users = await db.collection('users').get();
  const tokens = [];
  const ownersByToken = new Map();

  users.forEach((userDoc) => {
    if (excludeUid && userDoc.id === excludeUid) return;
    const userTokens = userDoc.get('pushTokens');
    if (!Array.isArray(userTokens)) return;
    userTokens.forEach((token) => {
      if (typeof token === 'string' && token.length > 20) {
        tokens.push(token);
        ownersByToken.set(token, userDoc.ref);
      }
    });
  });

  for (let start = 0; start < tokens.length; start += 500) {
    const batch = tokens.slice(start, start + 500);
    const result = await messaging.sendEachForMulticast({
      tokens: batch,
      notification: { title, body },
      data: {
        target,
        eventId: String(eventId || ''),
      },
      android: {
        priority: 'high',
        notification: {
          channelId: 'pettalopo_general',
          sound: 'default',
          clickAction: 'FLUTTER_NOTIFICATION_CLICK',
        },
      },
    });

    const invalidTokens = [];
    result.responses.forEach((response, index) => {
      if (!response.success) {
        const code = response.error && response.error.code;
        if (
          code === 'messaging/registration-token-not-registered' ||
          code === 'messaging/invalid-registration-token'
        ) {
          invalidTokens.push(batch[index]);
        }
      }
    });

    await Promise.all(invalidTokens.map((token) => {
      const owner = ownersByToken.get(token);
      return owner ? owner.update({
        pushTokens: admin.firestore.FieldValue.arrayRemove(token),
      }) : Promise.resolve();
    }));
  }
}

exports.notifyNewAmbalanChat = onDocumentCreated(
  'ambalan_chats/{messageId}',
  async (event) => {
    const message = event.data && event.data.data();
    if (!message || String(event.params.messageId).startsWith('chat_welcome_')) return;
    const body = message.type === 'list'
      ? (message.listTitle || 'Daftar baru dibagikan di grup Ambalan')
      : (message.text || 'Ada pesan baru di grup Ambalan');
    await sendToMembers({
      title: message.senderName
        ? 'Chat Ambalan · ' + message.senderName
        : 'Pesan baru Ambalan',
      body: String(body).slice(0, 180),
      target: 'chat',
      excludeUid: message.senderId,
      eventId: event.params.messageId,
    });
  }
);

exports.notifyNewPengumuman = onDocumentCreated(
  'pengumuman/{announcementId}',
  async (event) => {
    const announcement = event.data && event.data.data();
    if (!announcement) return;
    const title = announcement.judul || announcement.title || 'Pengumuman Ambalan';
    const body = announcement.isi || announcement.deskripsi || announcement.body || announcement.message || 'Ada pengumuman baru dari Ambalan.';
    await sendToMembers({
      title: String(title).slice(0, 100),
      body: String(body).slice(0, 180),
      target: 'pengumuman',
      excludeUid: announcement.createdByUid || announcement.senderId,
      eventId: event.params.announcementId,
    });
  }
);
