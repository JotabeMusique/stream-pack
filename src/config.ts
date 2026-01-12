export const LOCALSTORAGE_PREFIX = 'jotabe-streampack:';

export const BACKGROUND_PIANO_LENGTH = 442;
export const BACKGROUND_PIANO_PAD = 8;
export const ANY_MENTION_REGEX = /@[a-z0-9_]+/gi;

export const PRESENTATION_DISPLAY_TIME = 6000;

export const TITLE_REGEX = /^(\[(?<category>[^\]]+)\]\s*)?(?<title>.+?)(?<subtitle>( - | \/ |: ).*?)?(?<suffix>!\w+[-,\s]*)*$/ui;

export const GUEST_MAX_COUNT = 6;

export const COLORSCHEME_MATCH = [
  { regex: /théorie|theorie|cours|solfège|solfege|inter-?promo/i, colorscheme: 'brass'},
  { regex: /politique|philo|débat/i, colorscheme: 'red'},
  { regex: /2020/, colorscheme: 'promo2020'},
  { regex: /2021/, colorscheme: 'promo2021'},
  { regex: /2023/, colorscheme: 'promo2023'},
  { regex: /2024/, colorscheme: 'promo2024'},
  { regex: /2025/, colorscheme: 'promo2025'},
  { regex: /2026/, colorscheme: 'promo2026'},
];

export const PRESENTATION_MATCH = [
  { regex: /2020/, stinger: 'stinger-2020'},
  { regex: /2021/, stinger: 'stinger-2021'},
  { regex: /2023/, stinger: 'stinger-2023'},
  { regex: /2024/, stinger: 'stinger-2024'},
  { regex: /2025/, stinger: 'stinger-2025'},
  { regex: /2026/, stinger: 'stinger-2020'},
  { regex: /inter-?promo/i, stinger: 'stinger-interpromo'},
]


export const MONTHS = {
  0: 'JAN',
  1: 'FÉV',
  2: 'MAR',
  3: 'AVR',
  4: 'MAI',
  5: 'JUIN',
  6: 'JUIL',
  7: 'AOÛT',
  8: 'SEP',
  9: 'OCT',
  10: 'NOV',
  11: 'DÉC',
};
