import type { StreamTitleInfo } from './types';
import {
  TITLE_REGEX,
  ANY_MENTION_REGEX,
  COLORSCHEME_MATCH
} from './config';

export function titleCase(text: string) {
  return text.replace(/([^\s])([^\s]*)/g, (_, i, r) => (i + (r ?? '').toLocaleLowerCase('fr')));
}

export function trim(text: string) {
  return text.replace(/^([\/.\-,_\s\]):]+)/g, '').replace(/([\/.\-,_\s(\[:]+)$/g, '');
}

export function parseTitle(title: string): StreamTitleInfo {
  const matches = title.match(TITLE_REGEX);

  if (!matches) {
    return {
      category: '',
      title,
      subtitle: null,
      suffix: '',
    }
  }

  return {
    category: trim(matches.groups?.category || ''),
    title: trim(matches.groups?.title ?? ''),
    subtitle: trim(matches.groups?.subtitle ?? ''),
    suffix: matches.groups?.suffix ?? ''
  };
}

export function formatTitle(info: StreamTitleInfo) {
  let title = '';

  if (info.category) title += `[${info.category}] `;
  title += info.title;
  if (info.subtitle) title += ` - ${info.subtitle}`;
  if (info.suffix) title += ` ${info.suffix}`;

  return title;
}

export function highlightMentions(title: string) {
  return title.replace(ANY_MENTION_REGEX, '<strong>$&</strong>');
}

export function matchColorScheme(categoryText: string | null) {
  if (categoryText) {
    const match = COLORSCHEME_MATCH.find((cm) => categoryText.match(cm.regex));
    
    if (match) return match.colorscheme;
  }

  return 'default';
}

export function isSameTitle(a: string, b: string) {
  const parsedA = parseTitle(a);
  const parsedB = parseTitle(b);

  if (titleCase(parsedA.category || '') !== titleCase(parsedB.category || '')) return false;
  if (parsedA.title.toLocaleLowerCase() !== parsedB.title.toLocaleLowerCase()) return false;
  // Ignore subtitles and suffix to avoid issues with moderator adjusting title

  return true;
}