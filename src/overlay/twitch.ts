
import { StaticAuthProvider } from "@twurple/auth";
import { ApiClient } from '@twurple/api';
import { EventSubWsListener } from '@twurple/eventsub-ws';
import type { EventSubChannelCheerEvent, EventSubChannelFollowEvent, EventSubChannelRaidEvent, EventSubChannelSubscriptionEvent, EventSubChannelSubscriptionGiftEvent, EventSubChannelSubscriptionMessageEvent, EventSubChannelUpdateEvent } from "@twurple/eventsub-base";
import { getCache, getTwitchCredentials } from "../settings";
import { LOCALSTORAGE_PREFIX } from "../config";
import { formatTitle, isSameTitle } from "../utils";
import type { StreamTitleInfo } from "../types";

let apiClient: ApiClient;
let listener: EventSubWsListener;
let userId: string | null = null;

export type Guest = {
  id: string;
  name: string;
  displayName:string;
  profilePictureUrl: string;
}

export async function connect() {
  const {clientId, accessToken} = getTwitchCredentials();

  const authProvider = new StaticAuthProvider(clientId, accessToken);
  apiClient = new ApiClient({ authProvider });
  listener = new EventSubWsListener({ apiClient });

  const tokenInfo = await apiClient.getTokenInfo();
  userId = tokenInfo.userId;
  
  listener.start();
}

type GuestStarRawResonse = {
  data?: Array<{
    guests: Array<{user_id: string}>
  }>
}

export async function getGuests() {
  if (!userId) return [];

  const guestStar: GuestStarRawResonse | null = await apiClient.callApi({
    type: 'helix',
    url: '/guest_star/session',
    query: {
      broadcaster_id: userId,
      moderator_id: userId,
    }
  })

  if (!guestStar?.data?.length) return [];

  const userIds = guestStar.data[0].guests.map((g) => g.user_id).filter(g => g !== userId);

  const users = await apiClient.users.getUsersByIds(userIds)

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    displayName: u.displayName,
    profilePictureUrl: u.profilePictureUrl,
  }));
}

export async function getStreamTitle() {
  if (!userId) return;

  const channelInfo = await apiClient.channels.getChannelInfoById(userId);
  
  const streamTitle = channelInfo?.title;

  return streamTitle;
}

export async function getFollowers() {
  if (!userId) return;

  const followers = await apiClient.channels.getChannelFollowers(userId, undefined, { limit: 1 });

  const followersCount = followers.total;
  const lastFollower = followers.data.length ? followers.data[0].userDisplayName : null;

  return {
    followersCount,
    lastFollower,
  };
}

export async function getSubscriptions() {
  if (!userId) return;

  const allSubscriptions = await apiClient.subscriptions.getSubscriptionsPaginated(userId);
  const subscriptions = await allSubscriptions.getAll();
  // const lastUserSubscription = await apiClient.subscriptions.getSubscriptionForUser(userId, subscriptions[subscriptions.length-2].userId);

  const subscriptionsCount = subscriptions.length;
  const lastSubscription = subscriptions.length ? subscriptions[subscriptions.length-2].userDisplayName : null;

  return {
    subscriptionsCount,
    lastSubscription,
  };
}

export async function getViewersCount() {
  if (!userId) return;

  const streamData = await apiClient.streams.getStreamByUserId(userId);

  return streamData?.viewers;
}

export async function nextTitle() {
  if (!userId) return;

  const titles = JSON.parse(window.localStorage.getItem(LOCALSTORAGE_PREFIX + 'streamTitles') ?? '[]') as StreamTitleInfo[];

  if (!titles || !titles.length) return;

  const currentTitle = getCache().streamTitle;

  const currentTitleIndex = titles.findIndex(t => isSameTitle(formatTitle(t), currentTitle));

  if (titles[currentTitleIndex + 1]) {
    const title = formatTitle(titles[currentTitleIndex+1]);
    return await apiClient.channels.updateChannelInfo(userId, { title })
  } else {
    throw new Error('NO TITLE')
  }
}

export function onChannelFollow(handler: (event: EventSubChannelFollowEvent) => void) {
  if (!userId) return;

  listener.onChannelFollow(userId, userId, handler);
}

export function onChannelCheer(handler: (event: EventSubChannelCheerEvent) => void) {
  if (!userId) return;

  listener.onChannelCheer(userId, handler);
}

export function onChannelSubscription(handler: (event: EventSubChannelSubscriptionEvent) => void) {
  if (!userId) return;

  listener.onChannelSubscription(userId, handler);
}

export function onChannelSubscriptionGift(handler: (event: EventSubChannelSubscriptionGiftEvent) => void) {
  if (!userId) return;

  listener.onChannelSubscriptionGift(userId, handler);
}

export function onChannelSubscriptionMessage(handler: (event: EventSubChannelSubscriptionMessageEvent) => void) {
  if (!userId) return;

  listener.onChannelSubscriptionMessage(userId, handler);
}

export function onChannelRaidFrom(handler: (event: EventSubChannelRaidEvent) => void) {
  if (!userId) return;

  listener.onChannelRaidFrom(userId, handler);
}

export function onChannelUpdate(handler: (event: EventSubChannelUpdateEvent) => void) {
  if (!userId) return;

  listener.onChannelUpdate(userId, handler);
}

export type {
  EventSubChannelCheerEvent,
  EventSubChannelFollowEvent,
  EventSubChannelRaidEvent,
  EventSubChannelSubscriptionEvent,
  EventSubChannelSubscriptionGiftEvent,
  EventSubChannelSubscriptionMessageEvent,
  EventSubChannelUpdateEvent
};