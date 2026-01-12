import streamlabsJs from './streamlabs.js?raw';
import streamlabsCss from './streamlabs.css?raw';
import streamlabsHtml from './streamlabs.html?raw';

const USERNAMES = [
  'This_Username_is_Definitely_Too_Long',
  'la_jarre_a_son',
  'sentinel59',
  'jotabemusique',
  'arckanyas',
  'caridii_',
  'pignomaster',
  'ouaille44',
  'nolwainn',
  'pixels_farcies',
  'saphysushi',
  'mdeetz',
  'shin_64',
  'bobbiejohnny',
  'mok_80',
  'grenouilleww',
  'jo__',
  'dalilesque_',
  'hairratic',
  'titoukiww',
  'cathy64400',
  'elaydannn',
  'rockleader',
  'nastarios',
  'kupo57',
  'bnoruu',
  'solala10',
  'telfinn',
  'roshol',
  'zoutof',
  'supertefa',
  'ryuk_a',
  'mcognito',
  'mouiselichel',
  'patopestou',
  'pidikan',
  'taekilla',
  'qzuax',
  'barnabouc',
  'wedonefi',
  'aoseki_vt',
  'ou_li_po',
  'poullisch',
  'andraxis_',
  'eidie_',
  'pilouli',
  'dangerFckr',
  'potatalau',
  'scratuck',
];

const MESSAGES = [
  "Coucou JB comme ça va ?",
  "les accords c'est Maj7 ou 8 ?",
  "J'aime bien !",
  "Bonne soirée à toustes !",
  "@jotabemusique c'est comment la MG ?",
  "Trop bien !",
  "C'est clair",
  "clair",
  "tout est ok",
  "@la_jarre_a_son mais oui c'est clair !",
  "on a déjà fait la main droite de l'intro ?",
  "pour le doigté, 3 pour le premier Ré ? (pour avoir le 5 dispo pour le fa ensuite)",
  "Le travail de vitesse (et d'apprentissage au ralenti), je l'ai surtout fait sur mon morceau en autonomie, et ça a super bien marché",
  "Bonjour !",
  "Salut @jotabe",
  "Trop hâte d'attaquer la suite"
];

const DEFAULT_DETAIL = {
  "priority": 10,
  "chatBoxSettings": {
    "theme": "chunky",
    "background_color": "#000000",
    "show_platform_icons": false,
    "show_bttv_emotes": true,
    "show_franker_emotes": true,
    "show_7tv_emotes": true,
    "hide_common_chat_bots": true,
    "hide_commands": true,
    "muted_chatters": "",
    "profanity_custom_words": "",
    "message_show_delay": 0,
    "always_show_messages": false,
    "message_hide_delay": 120000,
    "disable_message_animations": false,
    "alert_enabled": false,
    "alert_sound_href": "https://uploads.twitchalerts.com/sound-defaults/positive-game-sound-4.ogg",
    "alert_sound_volume": 50,
    "alert_trigger_threshold_enabled": true,
    "alert_threshold_cooldown": 30,
    "text_color": "#292726",
    "text_size": 18,
    "custom_json": {
      "broadcasterColor": {
        "label": "Couleur broadcaster",
        "type": "colorpicker",
        "value": "#370f39"
      },
      "usernameColor": {
        "label": "Couleur utilisateur",
        "type": "colorpicker",
        "value": "#edd2a6"
      },
      "messageColor": {
        "label": "Couleur message",
        "type": "colorpicker",
        "value": "#ffffff"
      },
      "promotionColor": {
        "label": "Couleur par defaut de promo",
        "type": "colorpicker",
        "value": "#222222"
      },
      "mentionRegex": {
        "label": "Regex de mention",
        "type": "textfield",
        "value": "@?jotabe| @?jb |jbpianiste"
      }
    },
    "twitch_enabled": true,
    "show_twitch_moderator_icons": true,
    "show_twitch_subscriber_icons": true,
    "show_turbo_icons": true,
    "show_premium_icons": true,
    "show_bits_icons": true,
    "show_sub_gifter_icons": true,
    "mobile": null,
    "studio": null,
    "whitelist": [
      "youtube.com",
      "youtu.be",
      "imgur.com",
      "youtube.com",
      "twitter.com",
      "steamcommunity.com"
    ]
  },
  "pic": "https://cdn.streamlabs.com/chatbox/fake_avatars/89f483e6-844e-4064-95d6-7ada85486929_small.jpg",
  "from": "",
  "body": "",
  "command": "PRIVMSG",
  "tags": {
      "color": "#1E90FF",
      "display-name": "Display Name",
      "emotes": "",
      "id": "72f6960a-dcc9-4134-ae57-13c5937c2134",
      "mod": "0",
      "room-id": "23161357",
      "subscriber": "0",
      "tmi-sent-ts": "1534527638116",
      "turbo": "0",
      "user-id": "84354825",
      "user-type": ""
  },
  "payload": {},
  "owner": false,
  "subscriber": false,
  "userType": "mod",
  "platform": "twitch_account",
  "platformAccountId": null,
  "messageId": null,
  "access_token": null
};

let messageIdCounter = 1;
const parser = new DOMParser();

function choose(arr: any[]) {
  const i = Math.floor(Math.random() * arr.length);
  
  return arr[i];
}

class CustomEvent extends Event {
  public detail: Object;

  constructor(type: string, eventInitDict?: EventInit, detail?: Object) {
    super(type, eventInitDict);
    this.detail = {
      ...DEFAULT_DETAIL,
      ...(detail || {}),
    }
  }
}

function addChatMessage() {
  const log = document.getElementById("log");
  const template = document.getElementById("chatlist_item");
  if (!template || !log) return;

  let html = template.innerHTML;

  const from = choose(USERNAMES);
  const message = choose(MESSAGES);
  const messageId = 'dummy-message-'+messageIdCounter;

  html = html.replace(/\{from\}/gi, from);
  html = html.replace(/\{message\}/gi, message);
  html = html.replace(/\{messageId\}/gi, messageId);

  const $msg = parser.parseFromString(html, 'text/html').body.firstElementChild;

  if (!$msg) return;

  log.append($msg);

  if (log.firstElementChild && log.childElementCount > 50) {
    log.removeChild(log.firstElementChild);
  }

  messageIdCounter += 1;

  const event = new CustomEvent('onEventReceived', undefined, {
    body: message,
    from,
    messageId,
  });

  document.dispatchEvent(event);

  setTimeout(addChatMessage, Math.floor(Math.random() * 2000));
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.innerHTML = streamlabsHtml;

  const streamlabScript = document.createElement('script');
  let slJs = streamlabsJs
  slJs = slJs.replace(/\{background_color\}/g, 'transparent');
  slJs = slJs.replace(/\{text_color\}/g, DEFAULT_DETAIL.chatBoxSettings.text_color);
  slJs = slJs.replace(/\{font_size\}/g, DEFAULT_DETAIL.chatBoxSettings.text_size + 'px');
  slJs = slJs.replace(/\{message_hide_delay\}/g, DEFAULT_DETAIL.chatBoxSettings.message_hide_delay + 'ms');
  slJs = slJs.replace(/\{usernameColor\}/g, DEFAULT_DETAIL.chatBoxSettings.custom_json.usernameColor.value);
  slJs = slJs.replace(/\{broadcasterColor\}/g, DEFAULT_DETAIL.chatBoxSettings.custom_json.broadcasterColor.value);
  slJs = slJs.replace(/\{messageColor\}/g, DEFAULT_DETAIL.chatBoxSettings.custom_json.messageColor.value);
  slJs = slJs.replace(/\{mentionRegex\}/g, DEFAULT_DETAIL.chatBoxSettings.custom_json.mentionRegex.value);
  streamlabScript.innerHTML = slJs;

  const streamlabsStylesheet = document.createElement('style');
  let slCss = streamlabsCss
  
  slCss = slCss.replace(/\{background_color\}/g, 'transparent');
  slCss = slCss.replace(/\{text_color\}/g, DEFAULT_DETAIL.chatBoxSettings.text_color);
  slCss = slCss.replace(/\{font_size\}/g, DEFAULT_DETAIL.chatBoxSettings.text_size + 'px');
  slCss = slCss.replace(/\{message_hide_delay\}/g, DEFAULT_DETAIL.chatBoxSettings.message_hide_delay + 'ms');
  slCss = slCss.replace(/\{usernameColor\}/g, DEFAULT_DETAIL.chatBoxSettings.custom_json.usernameColor.value);
  slCss = slCss.replace(/\{broadcasterColor\}/g, DEFAULT_DETAIL.chatBoxSettings.custom_json.broadcasterColor.value);
  slCss = slCss.replace(/\{messageColor\}/g, DEFAULT_DETAIL.chatBoxSettings.custom_json.messageColor.value);
  slCss = slCss.replace(/\{mentionRegex\}/g, DEFAULT_DETAIL.chatBoxSettings.custom_json.mentionRegex.value);
  streamlabsStylesheet.innerHTML = slCss;

  document.body.append(streamlabScript);
  document.body.append(streamlabsStylesheet);

  addChatMessage();
});