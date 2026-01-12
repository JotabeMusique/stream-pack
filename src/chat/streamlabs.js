const MENTION_REGEX = new RegExp('{mentionRegex}', 'i');
const ANY_MENTION_REGEX = /@[a-z0-9_]+/gi;
const BROADCASTER = 'jotabemusique';

const PROMOTION_COLORS = {
  '2020': '#E06020',
  '2021': '#7030a0',
  '2023': '#a02040',
  '2024': '#249424',
  '2025': '#205090',
  '2026': '#f0a000',
}

const pupilInfoCache = new Map();

async function getPupilInfo(username) {
  const existingInfo = pupilInfoCache.get(username);
  // return null;
  if (existingInfo) {
    return existingInfo;
  } else {
    return fetch('https://api.jb.sentidev.fr/api/users/'+username)
      .then((resp) => {
        const info = resp.json();
        pupilInfoCache.set(username, info);
        return info;
      });
  }
}

// Please use event listeners to run functions.
document.addEventListener('onLoad', function (obj) {
  // obj will be empty for chat widget
  // this will fire only once when the widget loads
});

document.addEventListener('onEventReceived', async function (obj) {
  if (obj['detail']['command'] === 'PRIVMSG') {
    const messageId = obj['detail']['messageId'];
    const body = obj['detail']['body'];
    const from = obj['detail']['from'];

    const messageElement = document.querySelector(`[data-id="${messageId}"]`);

    if (!messageElement) return;

    const messageClientRect = messageElement.getBoundingClientRect();
    messageElement.style.setProperty('--message-height', messageClientRect.height+'px');

    messageElement.innerHTML = messageElement.innerHTML.replace(ANY_MENTION_REGEX, '<strong>$&</strong>');

    if (body.match(MENTION_REGEX)) {
      messageElement.classList.add('hasMention');
    }

    if (from === BROADCASTER) {
      messageElement.classList.add('broadcaster');
    }
    
    try {
      const pupilInfo = await getPupilInfo(from);
      if (pupilInfo) {
        const promotionElement = messageElement.querySelector('.promotion');

        if (!promotionElement) return;
  
        promotionColor = PROMOTION_COLORS[pupilInfo.promotion.toString()] || pupilInfo.color || '#222222';
        promotionElement.style.setProperty('--promotion-color', promotionColor);
        promotionElement.innerHTML = pupilInfo.promotion;
      }
    } catch (e) {}
  }
});