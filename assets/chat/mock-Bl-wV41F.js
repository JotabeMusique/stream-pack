import"../B5Qt9EMX.js";const u=`const MENTION_REGEX = new RegExp('{mentionRegex}', 'i');
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

    const messageElement = document.querySelector(\`[data-id="\${messageId}"]\`);

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
});`,p=`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Hanken+Grotesk:ital,wght@0,100..900;1,100..900&display=swap');

@keyframes shakeX {
  0%,
  25% {
    transform: translate3d(0, 0, 0);
  }

  5%,
  15% {
    transform: translate3d(-.1em, 0, 0);
  }

  10%,
  20% {
    transform: translate3d(.1em, 0, 0);
  }
}

@keyframes slideUp {
  0% {
    opacity: 0;
    margin-bottom: calc(var(--message-height) * -1);
  }
  100% {
    opacity: 1;
    margin-bottom: 8px;
  }
}

* {
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 0;
  margin: 0;
}

body {
  background: {background_color};
  font-family: 'Hanken Grotesk';
  font-weight: 500;
  font-size: {font_size};
  line-height: 1.5em;
  color: {text_color};
}

#messages {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#log .message {
  animation: slideUp .6s cubic-bezier(0.33, 1, 0.68, 1) forwards, fadeOutUp 0.5s ease {message_hide_delay} forwards;
  -webkit-animation: slideUp .6s cubic-bezier(0.33, 1, 0.68, 1) forwards, fadeOutUp 0.5s ease {message_hide_delay} forwards;
}

#log .message.hasMention {
  animation: slideUp .6s cubic-bezier(0.33, 1, 0.68, 1) forwards, fadeOutUp 0.5s ease {message_hide_delay} forwards, shakeX 2s ease 0.5s infinite;
  -webkit-animation: slideUp .6s cubic-bezier(0.33, 1, 0.68, 1) forwards, fadeOutUp 0.5s ease {message_hide_delay} forwards, shakeX 2s ease 0.5s infinite;
}

.colon {
  display: none;
}

#log {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 16px 16px 8px;
  width: 100%;
}

#log .message {
	margin-bottom: 8px;
}

#log .message.deleted {
  visibility: hidden;
}

#log .emote {
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  padding: 0.4em 0.2em;
  position: relative;
}

#log .emote img {
  display: inline-block;
  height: 1em;
  opacity: 0;
}

#log .meta,
#log .content {
  vertical-align: top;
}

#log .meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.5em;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: -0.75em;
  gap: 0.5em;
}

#log .content {
  background-color: var(--message-color, {messageColor});
  word-wrap: break-word;
  padding: 0.75em 0.5em 0.25em;
  border-radius: 0.5em;
}

.badge {
  position: relative;
  display: inline-block;
  margin: 0 0.2em;
  height: 1.2em;
  vertical-align: middle;
}

.promotion {
  background: var(--promotion-color, {promotionColor});
  font-family: 'DM Serif Display', serif;
  color: white;
  position: relative;
  display: inline-block;
  padding: 0 0.5em;
  border-radius: 1em;
  font-weight: bold;
  min-width: 3.5em;
  text-align: center;
}

.promotion:empty {
  display: none;
}

.name {
  font-weight: 700;
  padding: 0 0.5em;
  border-radius: 1em;
  background-color: var(--username-color, {usernameColor});
  color: {text_color};
  flex-shrink: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message.hasMention .name {
  color: white;
  background-color: {text_color};
}

.message.broadcaster .name {
  color: white;
  background-color: var(--broadcaster-color, {broadcasterColor});
}`,g=`<!-- item will be appended to this layout -->
<div id="messages">
    <div id="log" class="sl__chat__layout">
    </div>
</div>

<!-- chat item -->
<script type="text/template" id="chatlist_item">
    <div class="message" data-from="{from}" data-id="{messageId}">
        <div class="meta">
            <div class="name">{from}</div>
            <div class="promotion"></div>
        </div>

        <div class="content">{message}</div>
    </div>
<\/script>`,h=["This_Username_is_Definitely_Too_Long","la_jarre_a_son","sentinel59","jotabemusique","arckanyas","caridii_","pignomaster","ouaille44","nolwainn","pixels_farcies","saphysushi","mdeetz","shin_64","bobbiejohnny","mok_80","grenouilleww","jo__","dalilesque_","hairratic","titoukiww","cathy64400","elaydannn","rockleader","nastarios","kupo57","bnoruu","solala10","telfinn","roshol","zoutof","supertefa","ryuk_a","mcognito","mouiselichel","patopestou","pidikan","taekilla","qzuax","barnabouc","wedonefi","aoseki_vt","ou_li_po","poullisch","andraxis_","eidie_","pilouli","dangerFckr","potatalau","scratuck"],_=["Coucou JB comme ça va ?","les accords c'est Maj7 ou 8 ?","J'aime bien !","Bonne soirée à toustes !","@jotabemusique c'est comment la MG ?","Trop bien !","C'est clair","clair","tout est ok","@la_jarre_a_son mais oui c'est clair !","on a déjà fait la main droite de l'intro ?","pour le doigté, 3 pour le premier Ré ? (pour avoir le 5 dispo pour le fa ensuite)","Le travail de vitesse (et d'apprentissage au ralenti), je l'ai surtout fait sur mon morceau en autonomie, et ça a super bien marché","Bonjour !","Salut @jotabe","Trop hâte d'attaquer la suite"],o={priority:10,chatBoxSettings:{theme:"chunky",background_color:"#000000",show_platform_icons:!1,show_bttv_emotes:!0,show_franker_emotes:!0,show_7tv_emotes:!0,hide_common_chat_bots:!0,hide_commands:!0,muted_chatters:"",profanity_custom_words:"",message_show_delay:0,always_show_messages:!1,message_hide_delay:12e4,disable_message_animations:!1,alert_enabled:!1,alert_sound_href:"https://uploads.twitchalerts.com/sound-defaults/positive-game-sound-4.ogg",alert_sound_volume:50,alert_trigger_threshold_enabled:!0,alert_threshold_cooldown:30,text_color:"#292726",text_size:18,custom_json:{broadcasterColor:{label:"Couleur broadcaster",type:"colorpicker",value:"#370f39"},usernameColor:{label:"Couleur utilisateur",type:"colorpicker",value:"#edd2a6"},messageColor:{label:"Couleur message",type:"colorpicker",value:"#ffffff"},promotionColor:{label:"Couleur par defaut de promo",type:"colorpicker",value:"#222222"},mentionRegex:{label:"Regex de mention",type:"textfield",value:"@?jotabe| @?jb |jbpianiste"}},twitch_enabled:!0,show_twitch_moderator_icons:!0,show_twitch_subscriber_icons:!0,show_turbo_icons:!0,show_premium_icons:!0,show_bits_icons:!0,show_sub_gifter_icons:!0,mobile:null,studio:null,whitelist:["youtube.com","youtu.be","imgur.com","youtube.com","twitter.com","steamcommunity.com"]},pic:"https://cdn.streamlabs.com/chatbox/fake_avatars/89f483e6-844e-4064-95d6-7ada85486929_small.jpg",from:"",body:"",command:"PRIVMSG",tags:{color:"#1E90FF","display-name":"Display Name",emotes:"",id:"72f6960a-dcc9-4134-ae57-13c5937c2134",mod:"0","room-id":"23161357",subscriber:"0","tmi-sent-ts":"1534527638116",turbo:"0","user-id":"84354825","user-type":""},payload:{},owner:!1,subscriber:!1,userType:"mod",platform:"twitch_account",platformAccountId:null,messageId:null,access_token:null};let l=1;const f=new DOMParser;function c(t){const e=Math.floor(Math.random()*t.length);return t[e]}class b extends Event{detail;constructor(e,s,n){super(e,s),this.detail={...o,...n||{}}}}function m(){const t=document.getElementById("log"),e=document.getElementById("chatlist_item");if(!e||!t)return;let s=e.innerHTML;const n=c(h),a=c(_),i="dummy-message-"+l;s=s.replace(/\{from\}/gi,n),s=s.replace(/\{message\}/gi,a),s=s.replace(/\{messageId\}/gi,i);const r=f.parseFromString(s,"text/html").body.firstElementChild;if(!r)return;t.append(r),t.firstElementChild&&t.childElementCount>50&&t.removeChild(t.firstElementChild),l+=1;const d=new b("onEventReceived",void 0,{body:a,from:n,messageId:i});document.dispatchEvent(d),setTimeout(m,Math.floor(Math.random()*2e3))}document.addEventListener("DOMContentLoaded",()=>{document.body.innerHTML=g;const t=document.createElement("script");let e=u;e=e.replace(/\{background_color\}/g,"transparent"),e=e.replace(/\{text_color\}/g,o.chatBoxSettings.text_color),e=e.replace(/\{font_size\}/g,o.chatBoxSettings.text_size+"px"),e=e.replace(/\{message_hide_delay\}/g,o.chatBoxSettings.message_hide_delay+"ms"),e=e.replace(/\{usernameColor\}/g,o.chatBoxSettings.custom_json.usernameColor.value),e=e.replace(/\{broadcasterColor\}/g,o.chatBoxSettings.custom_json.broadcasterColor.value),e=e.replace(/\{messageColor\}/g,o.chatBoxSettings.custom_json.messageColor.value),e=e.replace(/\{mentionRegex\}/g,o.chatBoxSettings.custom_json.mentionRegex.value),t.innerHTML=e;const s=document.createElement("style");let n=p;n=n.replace(/\{background_color\}/g,"transparent"),n=n.replace(/\{text_color\}/g,o.chatBoxSettings.text_color),n=n.replace(/\{font_size\}/g,o.chatBoxSettings.text_size+"px"),n=n.replace(/\{message_hide_delay\}/g,o.chatBoxSettings.message_hide_delay+"ms"),n=n.replace(/\{usernameColor\}/g,o.chatBoxSettings.custom_json.usernameColor.value),n=n.replace(/\{broadcasterColor\}/g,o.chatBoxSettings.custom_json.broadcasterColor.value),n=n.replace(/\{messageColor\}/g,o.chatBoxSettings.custom_json.messageColor.value),n=n.replace(/\{mentionRegex\}/g,o.chatBoxSettings.custom_json.mentionRegex.value),s.innerHTML=n,document.body.append(t),document.body.append(s),m()});
