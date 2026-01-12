import { StaticAuthProvider } from "@twurple/auth";
import { ApiClient } from '@twurple/api';
import { EventSubWsListener } from '@twurple/eventsub-ws';
import type { EventSubChannelUpdateEvent } from "@twurple/eventsub-base";
import { getSettingsFromQS, getTwitchCredentials } from "../settings";

import type { StreamTitleInfo } from "../types";
import { LOCALSTORAGE_PREFIX } from "../config";
import colorschemes from '../colorschemes.json';
import { formatTitle, isSameTitle, matchColorScheme, parseTitle } from "../utils";

import './dock.css'

const TITLE_HAS_NUMBER_REGEX = /cours|leçon|n°/ig;
const TITLE_NUMBER_REGEX = /[0-9]{1,3}/g;

let apiClient: ApiClient;
let listener: EventSubWsListener;
let userId: string | null = null;
let editingIndex: number | null = null;

let currentTitle = '';
let currentTitleIndex = -1;

const titles: StreamTitleInfo[] = readTitles();

function readTitles() {
  try {
    return JSON.parse(window.localStorage.getItem(LOCALSTORAGE_PREFIX + 'streamTitles') ?? '[]') || [] as StreamTitleInfo[];
  } catch (_err) {
    return [] as StreamTitleInfo[];
  }
};

function writeTitles() {
  window.localStorage.setItem(LOCALSTORAGE_PREFIX + 'streamTitles', JSON.stringify(titles));
};

export async function connect() {
  const {clientId, accessToken} = getTwitchCredentials();

  const authProvider = new StaticAuthProvider(clientId, accessToken);
  apiClient = new ApiClient({ authProvider });
  listener = new EventSubWsListener({ apiClient });

  const tokenInfo = await apiClient.getTokenInfo();
  userId = tokenInfo.userId;
  
  listener.start();
}

export async function getStreamTitle() {
  if (!userId) return;

  const channelInfo = await apiClient.channels.getChannelInfoById(userId);
  
  currentTitle = channelInfo?.title ?? '';

  const $currentTitle = document.getElementById('currentTitle') as HTMLDivElement;
  $currentTitle.textContent = currentTitle;
}

export async function setStreamTitle(title: string) {
  if (!userId) return;

  await apiClient.channels.updateChannelInfo(userId, { title });

  const $updatingIcon = document.getElementById('updatingIcon') as HTMLDivElement;
  $updatingIcon.classList.add('--updating');
}

export function handleChannelUpdate(event: EventSubChannelUpdateEvent) {
  const newTitle = event.streamTitle;

  currentTitle = newTitle ?? '';

  const $currentTitle = document.getElementById('currentTitle') as HTMLDivElement;
  $currentTitle.textContent = currentTitle;

  const $updatingIcon = document.getElementById('updatingIcon') as HTMLDivElement;
  $updatingIcon.classList.remove('--updating');
  
  buildTitles();
}

function editTitle(index: number) {
  if (index >= titles.length) return;

  editingIndex = index;

  const title = titles[index];

  buildTitles();

  const $input = document.getElementById('title') as HTMLInputElement;
  $input.value = formatTitle(title);
  
  const $form = document.getElementById('newTitle') as HTMLFormElement;
  $form.classList.add('--editing');
}

function deleteTitle(index: number) {
  console.log
  titles.splice(index, 1);

  writeTitles();
  buildTitles();
}

function moveUpTitle(index: number) {
  if (index < 1) return;

  const title = titles.splice(index, 1);
  titles.splice(index - 1 , 0, title[0]);

  writeTitles();
  buildTitles();
}

function moveDownTitle(index: number) {
  if (index > titles.length - 2) return;
  
  const title = titles.splice(index, 1);
  titles.splice(index + 1 , 0, title[0]);

  writeTitles();
  buildTitles();
}

async function activateTitle(index: number) {

  const title = titles[index];

  if (!title) return;

  await setStreamTitle(formatTitle(title));
}

function refreshCurrentTitleIndex() {
  currentTitleIndex = titles.findIndex((t) => isSameTitle(formatTitle(t), currentTitle)); 
}

function buildTitles() {
  refreshCurrentTitleIndex();

  const $list = document.getElementById('streamTitles');
  const templateListItem = document.querySelector('#listItemTemplate') as HTMLTemplateElement;

  if (!$list) return;

  $list.innerHTML = '';

  titles.forEach((st: StreamTitleInfo, index: number) => {
    const $item = document.importNode(templateListItem.content, true) ;
    const $listItem = $item.querySelector('.listItem') as HTMLDivElement;
    const $category = $item.querySelector('.data-category') as HTMLDivElement;
    const $title = $item.querySelector('.data-title') as HTMLDivElement;
    const $subtitle = $item.querySelector('.data-subtitle') as HTMLSpanElement;
    const $suffix = $item.querySelector('.data-suffix') as HTMLSpanElement;

    if (index === currentTitleIndex) {
      $listItem.classList.add('--current');
      $item.querySelector('.action-activate')?.classList.remove('btn--neutral');
      $item.querySelector('.action-activate')?.classList.add('btn--active');
    }

    if ($category) {
      const colorScheme = matchColorScheme(st.category) as keyof typeof colorschemes;
      if (colorschemes && colorScheme) {
        $listItem.style.setProperty('--category-background', colorschemes[colorScheme].primary.background);
        $listItem.style.setProperty('--category-text', colorschemes[colorScheme].primary.text);
      }
      $category.textContent = st.category;
    }
    if ($title) {
      if (st.title.match(TITLE_HAS_NUMBER_REGEX)){
        $title.innerHTML = st.title.replace(TITLE_NUMBER_REGEX, '<u>$&</u>');
      } else {
        $title.innerHTML = st.title;
      }
    }
    if ($subtitle) $subtitle.textContent = st.subtitle;
    if ($suffix) $suffix.textContent = st.suffix;

    if (editingIndex === index){
      $item.querySelector('.action-edit')?.classList.add('btn--active');
    }
    
    $item.querySelector('.action-activate')?.addEventListener('click', () => activateTitle(index));
    $item.querySelector('.action-up')?.addEventListener('click', () => moveUpTitle(index));
    $item.querySelector('.action-down')?.addEventListener('click', () => moveDownTitle(index));
    $item.querySelector('.action-edit')?.addEventListener('click', () => editTitle(index));
    $item.querySelector('.action-delete')?.addEventListener('click', () => deleteTitle(index));

    $list?.append($item)
  });
}

function addTitle(event: Event) {
  event.preventDefault();

  const $input = document.getElementById('title') as HTMLInputElement;
  const newTitle = $input.value;
  $input.value = '';
  const info = parseTitle(newTitle);

  if (editingIndex !== null) {
    const $form = document.getElementById('newTitle') as HTMLFormElement;
    
    titles.splice(editingIndex, 1, info);
    
    $form.classList.remove('--editing');
    editingIndex = null;
  } else {
    titles.push(info);
  }
  writeTitles();
  buildTitles();
}

function resetTitle(event: Event) {
  event.preventDefault();

  const $input = document.getElementById('title') as HTMLInputElement;
  $input.value = '';

  const $form = document.getElementById('newTitle') as HTMLFormElement;
  $form.classList.remove('--editing');

  editingIndex = null;
  buildTitles();
}

function incrementTitles() {
  titles.forEach((st: StreamTitleInfo) => {
    if (!st.title.match(TITLE_HAS_NUMBER_REGEX)) return;

    const newTitle = st.title.replace(TITLE_NUMBER_REGEX, (match: string) => {
      return (Number(match) + 1).toString();
    })

    st.title = newTitle;
  });

  writeTitles();
  buildTitles();
}

function decrementTitles() {
  titles.forEach((st: StreamTitleInfo) => {
    if (!st.title.match(TITLE_HAS_NUMBER_REGEX)) return;

    const newTitle = st.title.replace(TITLE_NUMBER_REGEX, (match: string) => {
      return (Number(match) - 1).toString();
    })

    st.title = newTitle;
  });

  writeTitles();
  buildTitles();
}

async function nextTitle() {
  await activateTitle(currentTitleIndex + 1);
}

document.addEventListener('DOMContentLoaded', async () => {
  getSettingsFromQS();

  try {
    await connect();
    await getStreamTitle();
  } catch(err) {
    let message = (err as Error).message;
    try {
      message = JSON.parse((err as (Error & {body?: string})).body ?? '').message ?? message;
    } catch(e) {}

    const $currentTitle = document.getElementById('currentTitle') as HTMLDivElement;
    $currentTitle.textContent = 'Impossible de se connecter à Twitch: '+message;
    $currentTitle.classList.add('--error');
  }

  buildTitles();

  if (userId) {
    listener.onChannelUpdate(userId, handleChannelUpdate);
  } else {

  }

  (document.getElementById('nextTitleBtn') as HTMLButtonElement).addEventListener('click', nextTitle);
  (document.getElementById('incrementTitleBtn') as HTMLButtonElement).addEventListener('click', incrementTitles);
  (document.getElementById('decrementTitleBtn') as HTMLButtonElement).addEventListener('click', decrementTitles);
  (document.getElementById('newTitle') as HTMLFormElement).addEventListener('submit', addTitle);
  (document.getElementById('newTitle') as HTMLFormElement).addEventListener('reset', resetTitle);
});