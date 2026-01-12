export type StreamTitleInfo = {
  category: string | null,
  title: string,
  subtitle: string | null
  suffix: string | null
}

export type SocialInfo = {
  title: string;
  description: string;
  url: string;
  icon: string;
  color: string;
  linkColor?: string;
}

export type ColorVariants = 'base' | 'neutral' | 'accent' | 'primary' | 'secondary';

export type ColorScheme = {
  [key in ColorVariants]?: {
    text: string;
    background: string;
  }
}