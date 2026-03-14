import { forceRevealPresentation, preloadNextPresentationBackground, refreshDateTime, rotateSocials, setGuests, setTileUserValue, setTileValue, setTitle } from './ui';
import { connect, getFollowers, getGuests, getStreamTitle, getSubscriptions,  getViewersCount, nextTitle, onChannelFollow, onChannelSubscription, onChannelSubscriptionGift, onChannelSubscriptionMessage, onChannelUpdate, type EventSubChannelFollowEvent, type EventSubChannelSubscriptionEvent, type EventSubChannelSubscriptionGiftEvent, type EventSubChannelSubscriptionMessageEvent, type EventSubChannelUpdateEvent } from './twitch';

import './style.css'
import { getCache, getParams, getSettingsFromQS, setCacheData, setParam } from '../settings';

const OBS_START_SCENE_REGEX = /début/gi;
let obsCurrentScene = '';

function log(message: string, isError = false) {
  const $log = document.getElementById('log') as HTMLDivElement;

  $log.innerHTML = message;

  if (isError) {
    $log.classList.add('isError');
  } else {
    $log.classList.remove('isError');
  }
}

function initStats() {
  const cachedInfo = getCache();

  if (cachedInfo.streamTitle) setTitle(cachedInfo.streamTitle, { skipTransition: true });
  if (cachedInfo.lastFollower) setTileUserValue('lastFollower', cachedInfo.lastFollower, undefined, true);
  if (cachedInfo.lastSubscription) setTileUserValue('lastSubscriber', cachedInfo.lastSubscription, undefined, true);

  setTileValue('viewers', '?');

  if (cachedInfo.guests) {
    setGuests(cachedInfo.guests);
  }
}

async function refreshStats() {
  const streamTitle = await getStreamTitle();
  setCacheData('streamTitle', streamTitle);

  const followers = await getFollowers();
  if (followers) {
    setCacheData('lastFollower', followers.lastFollower);
    setCacheData('followersCount', followers.followersCount);
  }

  const subscriptions = await getSubscriptions();
  if (subscriptions) {
    setCacheData('lastSubscription', subscriptions.lastSubscription);
    setCacheData('subscriptionsCount', subscriptions.subscriptionsCount);
  }

  initStats();
}

async function refreshGuests() {
  const guests = await getGuests();

  setCacheData('guests', guests);

  setGuests(guests);
}

async function refreshViewersCount() {
  try {
    const viewersCount =  await getViewersCount();
    setTileValue('viewers', viewersCount?.toString() ?? '?');
  } catch(err) {
    setTileValue('viewers', '?');
  }
}

function handleChannelUpdate(event: EventSubChannelUpdateEvent) {
  const newTitle = event.streamTitle;

  setCacheData('streamTitle', newTitle);
  
  setTitle(newTitle, {
    beforePresentation: obsStopRecording,
    afterPresentation: obsStartRecording,
  });

  log("Stream Title changed");
}

function handleChannelFollow(event: EventSubChannelFollowEvent) {
  const { followersCount } = getCache();
  const newFollower = event.userDisplayName;

  setCacheData('lastFollower', newFollower);
  setCacheData('followersCount', followersCount + 1);

  setTileUserValue('lastFollower', newFollower);
  log("New Follower: " + newFollower);
}

function handleChannelSubscriber(event: EventSubChannelSubscriptionEvent) {
  const { subscriptionsCount } = getCache();
  const newSubscriber = event.userDisplayName;

  setCacheData('lastSubscription', newSubscriber);
  setCacheData('subscriptionsCount', subscriptionsCount + 1);

  setTileUserValue('lastSubscriber', newSubscriber);
  log("New Subscriber: " + newSubscriber);
}

function handleChannelSubscriptionGift(event: EventSubChannelSubscriptionGiftEvent) {
  log("New Sub Gifts: " + event.gifterDisplayName + ' ('+event.amount+')');
}

function handleChannelSubscriptionMessage(event: EventSubChannelSubscriptionMessageEvent) {
  log("New Sub Message: " + event.userDisplayName + ': '+event.messageText);
}

/** OBS Interactions */

function getObsCurrentScene() {
  if (window.obsstudio) {
    window.obsstudio.getCurrentScene((scene: OBSSceneInfo) => {
      obsCurrentScene = scene.name;
    })
  }
}

function handleObsSceneChanged(event: CustomEvent<OBSSceneInfo> ) {
  if (obsCurrentScene && obsCurrentScene.match(OBS_START_SCENE_REGEX)) {
    forcePresentation();
  }

  obsCurrentScene = event.detail.name;
}

function obsStopRecording() {
  const params = getParams();

  if (window.obsstudio && params.autoRecording) {
    window.obsstudio.stopRecording();
    log("Recording stopped");
  }
}

function obsStartRecording() {
  const params = getParams();
  
  if (window.obsstudio && params.autoRecording) {
    window.obsstudio.startRecording();
    log("Recording started");
  }
}

function forcePresentation() {
  forceRevealPresentation({
    forcePresentation: true,
    beforePresentation: obsStopRecording,
    afterPresentation: obsStartRecording
  })
}

function refreshControlsStates() {
  const params = getParams();
  const $toggleAutoRecordingButton = document.getElementById('toggle_auto_recording') as HTMLButtonElement;
  const $toggleInitialPresentationButton = document.getElementById('toggle_initial_presentation') as HTMLButtonElement;

  if (params.autoRecording) {
    $toggleAutoRecordingButton.classList.add('active');
    $toggleAutoRecordingButton.textContent = 'AUTO RECORD: ACTIVE';
  } else {
    $toggleAutoRecordingButton.classList.remove('active');
    $toggleAutoRecordingButton.textContent = 'AUTO RECORD: INACTIVE';
  }

  if (params.initialPresentation) {
    $toggleInitialPresentationButton.classList.add('active');
    $toggleInitialPresentationButton.textContent = 'INITIAL PRESENTATION: ACTIVE';
  } else {
    $toggleInitialPresentationButton.classList.remove('active');
    $toggleInitialPresentationButton.textContent = 'INITIAL PRESENTATION: INACTIVE';
  }
}

function toggleAutoRecording() {
  const params = getParams();

  setParam('autoRecording', !params.autoRecording);

  refreshControlsStates();
}

function toggleInitialPresentation() {
  const params = getParams();

  setParam('initialPresentation', !params.initialPresentation);

  refreshControlsStates();
}

async function triggerNextTitle() {
  try {
    await nextTitle();
    log("Refreshing title...");
  } catch (err) {
    log('Failed to execute next title: '+(err as Error).message, true);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  getSettingsFromQS();
  refreshControlsStates();
  preloadNextPresentationBackground();
  refreshDateTime();
  initStats();
  
  document.body.classList.add('--ready');
  
  setInterval(refreshDateTime, 1000);
  setInterval(refreshViewersCount, 60000);
  setInterval(refreshGuests, 60000);
  setInterval(rotateSocials, 30000);
  
  try {
    await connect();
    await refreshStats();
    await refreshViewersCount();

    onChannelUpdate(handleChannelUpdate);
    onChannelFollow(handleChannelFollow);
    onChannelSubscription(handleChannelSubscriber);
    onChannelSubscriptionGift(handleChannelSubscriptionGift);
    onChannelSubscriptionMessage(handleChannelSubscriptionMessage);
  } catch(err) {
    console.error(err);
  }

  document.getElementById('force_presentation')?.addEventListener('click', forcePresentation);
  document.getElementById('socials')?.addEventListener('click', rotateSocials);
  document.getElementById('next_title')?.addEventListener('click', triggerNextTitle);
  document.getElementById('toggle_auto_recording')?.addEventListener('click', toggleAutoRecording);
  document.getElementById('toggle_initial_presentation')?.addEventListener('click', toggleInitialPresentation);

  if (window.obsstudio) {
    getObsCurrentScene();
    window.addEventListener('jotabe:forcePresentation', forcePresentation);
    window.addEventListener('jotabe:nextSocial', rotateSocials);
    window.addEventListener('jotabe:nextTitle', triggerNextTitle);
    window.addEventListener('obsSceneChanged', handleObsSceneChanged);
  }
});