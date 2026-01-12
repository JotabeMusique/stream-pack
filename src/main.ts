import qs from 'qs';

import { LOCALSTORAGE_PREFIX } from './config';

let accessToken: string| null = null;

const AUTH_SCOPES = [
  'bits:read',
  'chat:read',
  'channel:read:subscriptions',
  'channel:read:hype_train',
  'channel:manage:broadcast',
  'channel:read:polls',
  'channel:read:goals',
  'moderator:read:chatters',
  'moderator:read:shoutouts',
  'moderator:read:followers',
  'channel:read:guest_star',
  'channel:read:ads',
];

const DEFAULT_CLIENT_ID = 'yqiakkc9orym3jyf0ftl4dgvlobwtk';

let CLIENT_ID = window.localStorage.getItem(LOCALSTORAGE_PREFIX + 'twitchClientId') || DEFAULT_CLIENT_ID;

const AUTH_PAYLOAD = {
  response_type: 'token',
}

function getTwitchAuthURL(clientId: string) {
  const redirect_uri = window.location.origin + window.location.pathname;

  const $redirect_uri = document.getElementById('redirect_uri');
  if ($redirect_uri) {
    $redirect_uri.textContent = redirect_uri;
  }
  
  const payload = {
    ...AUTH_PAYLOAD,
    client_id: clientId,
    redirect_uri,
    scope: AUTH_SCOPES.join(' '),
  };

  return 'https://id.twitch.tv/oauth2/authorize?'+qs.stringify(payload);
}

function setTwitchLogin() {
  const $login = document.getElementById('login') as HTMLAnchorElement;
  $login.href = getTwitchAuthURL(CLIENT_ID);
}

function getTwitchAccessToken() {
  const hash = window.location.hash.substring(1);
  const auth = qs.parse(hash)

  if (auth.token_type === 'bearer' && auth.access_token){
    accessToken = auth.access_token as string;
  }
}

function refreshSourceUrls() {
  const rootUrl = window.location.origin + window.location.pathname.substring(
    0,
    window.location.pathname.endsWith('/')
    ? window.location.pathname.length - 1
    : undefined
  );

  if (accessToken) {
    const params = qs.stringify({
      'twitch.clientId': CLIENT_ID,
      'twitch.accessToken': accessToken,
    })


    const $auth_access_token = document.getElementById('auth_access_token') as HTMLInputElement;
    const $source_overlay_url = document.getElementById('source_overlay_url') as HTMLInputElement;
    const $source_music_url = document.getElementById('source_music_url') as HTMLInputElement;;
    const $dock_streamtitle_url = document.getElementById('dock_streamtitle_url') as HTMLInputElement;;

    $auth_access_token.value = accessToken;
    $source_overlay_url.value = rootUrl+'/overlay/?'+params;
    $source_music_url.value = rootUrl+'/music/';
    $dock_streamtitle_url.value = rootUrl+'/docks/streamTitle?'+params;
  }
}

function handleInputClick(event: FocusEvent) {
  (event.target as HTMLInputElement).select();
}

function handleClientIdChange(event: Event) {
  const clientId = (event.target as HTMLInputElement).value;

  if (clientId) {
    CLIENT_ID = clientId;

    window.localStorage.setItem(LOCALSTORAGE_PREFIX + 'twitchClientId', clientId);
  } else {
    CLIENT_ID = DEFAULT_CLIENT_ID;

    window.localStorage.removeItem(LOCALSTORAGE_PREFIX + 'twitchClientId');
  }

  setTwitchLogin();
}

document.addEventListener('DOMContentLoaded', async () => {
  setTwitchLogin();

  getTwitchAccessToken();
  refreshSourceUrls();

  document.querySelectorAll('input').forEach(($input) => {
    $input.addEventListener('focus', handleInputClick);
  })

  const $clientId = document.getElementById('auth_client_id') as HTMLInputElement;
  $clientId.addEventListener('change', handleClientIdChange);
  $clientId.value = CLIENT_ID;
});