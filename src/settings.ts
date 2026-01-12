
import qs from 'qs';

import { LOCALSTORAGE_PREFIX } from './config';

const CACHE_DEFAULT = {
  streamTitle: '',
  viewersCount: '',
  chattersCount: '',
  followersCount: '',
  lastFollower: '',
  subscriptionsCount: '',
  lastSubscription: '',
};

const settings = {
  twitch: {
    clientId: '',
    accessToken: '',
  },
  params: {
    autoRecording: false,
  }
}

Object.assign(settings.params, readParams());

const cache = readCache();

function readCache() {
  try {
    return JSON.parse(window.localStorage.getItem(LOCALSTORAGE_PREFIX + 'cache') ?? 'null') || CACHE_DEFAULT;
  } catch (_err) {
    return CACHE_DEFAULT;
  }
};

function writeCache() {
  window.localStorage.setItem(LOCALSTORAGE_PREFIX + 'cache', JSON.stringify(cache));
};


function readParams() {
  try {
    return JSON.parse(window.localStorage.getItem(LOCALSTORAGE_PREFIX + 'params') ?? 'null') || {};
  } catch (_err) {
    return {};
  }
};

function writeParams() {
  window.localStorage.setItem(LOCALSTORAGE_PREFIX + 'params', JSON.stringify(settings.params));
};


export function getSettingsFromQS() {
  const params = window.location.search;
  const qsSettings = qs.parse(params, { ignoreQueryPrefix: true, allowDots: true });

  Object.assign(settings, qsSettings);
}

export function setCacheData(name: string, value: any) {
  cache[name] = value;

  writeCache();
}

export function getCache() {
  return cache;
}

export function getTwitchCredentials() {
  return settings.twitch;
}

export function setParam(name: keyof typeof settings.params, value: any) {
  settings.params[name] = value;
  
  writeParams();
}

export function getParams() {
  return settings.params;
}