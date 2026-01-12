import socials from "../socials.json";
import colorschemes from "../colorschemes.json";

import {
  BACKGROUND_PIANO_LENGTH,
  BACKGROUND_PIANO_PAD,
  PRESENTATION_DISPLAY_TIME,
  GUEST_MAX_COUNT,
  PRESENTATION_MATCH,
  MONTHS,
} from "../config";

import {
  highlightMentions,
  matchColorScheme,
  parseTitle,
  titleCase,
} from "../utils";
import type { ColorScheme, SocialInfo, StreamTitleInfo } from "../types";

import type { Guest } from "./twitch";

type SetTitleOptions = {
  skipTransition?: boolean;
  forcePresentation?: boolean;
  beforePresentation?: () => void;
  afterPresentation?: () => void;
};

let socialsIndex = 0;
let currentCategory: string | null = null;
let currentTitle: string | null = null;
let presentationPending = false;

export function setColorscheme(
  colorschemeName: string,
  $element = document.body
) {
  if (!$element) return;

  if (colorschemeName in colorschemes) {
    const name = colorschemeName as keyof typeof colorschemes;
    const colorscheme = colorschemes[name] as ColorScheme;

    $element.style.setProperty(
      "--base-text",
      colorscheme.base?.text ?? colorschemes.default.base.text
    );
    $element.style.setProperty(
      "--base-background",
      colorscheme.base?.background ?? colorschemes.default.base.background
    );
    $element.style.setProperty(
      "--primary-text",
      colorscheme.primary?.text ?? colorschemes.default.primary.text
    );
    $element.style.setProperty(
      "--primary-background",
      colorscheme.primary?.background ?? colorschemes.default.primary.background
    );
    $element.style.setProperty(
      "--secondary-text",
      colorscheme.secondary?.text ?? colorschemes.default.secondary.text
    );
    $element.style.setProperty(
      "--secondary-background",
      colorscheme.secondary?.background ??
        colorschemes.default.secondary.background
    );
    $element.style.setProperty(
      "--accent-text",
      colorscheme.accent?.text ?? colorschemes.default.accent.text
    );
    $element.style.setProperty(
      "--accent-background",
      colorscheme.accent?.background ?? colorschemes.default.accent.background
    );
    $element.style.setProperty(
      "--neutral-text",
      colorscheme.neutral?.text ?? colorschemes.default.neutral.text
    );
    $element.style.setProperty(
      "--neutral-background",
      colorscheme.neutral?.background ?? colorschemes.default.neutral.background
    );
  }
}

async function waitTimeout(timeMs: number) {
  return new Promise((resolve) => setTimeout(resolve, timeMs));
}

function splitSubtitle(subtitle: string | null) {
  if (!subtitle) return "";

  const [first, ...rest] = subtitle.split(" - ");

  if (rest.length) {
    return `<p>${first}</p><p>${rest.join(" - ")}</p>`;
  }
  return `<p>${first}</p>`;
}

export async function revealPresentation(
  values: StreamTitleInfo,
  options: SetTitleOptions = {}
) {
  if (presentationPending) return false;

  const category = values.category;

  if (category) {
    const match = PRESENTATION_MATCH.find((cm) => category.match(cm.regex));

    if (match || options.forcePresentation) {
      if (options.beforePresentation) options.beforePresentation();

      const stinger = match?.stinger || "stinger-default";

      const $stinger = document.getElementById(stinger) as HTMLVideoElement;

      if ($stinger) {
        const $presentation = document.getElementById(
          "presentation"
        ) as HTMLDivElement;
        const $presentationTitle = document.getElementById(
          "presentationTitle"
        ) as HTMLDivElement;
        const $presentationSubtitle = document.getElementById(
          "presentationSubtitle"
        ) as HTMLDivElement;
        const $presentationCategory = document.getElementById(
          "presentationCategory"
        ) as HTMLDivElement;

        $presentationCategory.innerText = titleCase(values.category || "");
        $presentationTitle.innerHTML = highlightMentions(values.title);
        $presentationSubtitle.innerHTML = splitSubtitle(values.subtitle);

        presentationPending = true;

        $stinger.classList.add("--play");
        $stinger.play();

        const colorscheme = matchColorScheme(category);
        setColorscheme(colorscheme, $presentation);

        await waitTimeout(1333);

        $presentation?.classList.add("--show");

        await waitTimeout(2000);

        if (options.afterPresentation) options.afterPresentation();

        await waitTimeout(PRESENTATION_DISPLAY_TIME - 2000);

        $stinger.currentTime = 0;
        $stinger.play();

        await waitTimeout(1333);

        $presentation?.classList.remove("--show");

        preloadNextPresentationBackground();

        presentationPending = false;
        return true;
      }

      if (options.afterPresentation) options.afterPresentation();

      return false;
    }
  }
  return false;
}

export async function forceRevealPresentation(options: SetTitleOptions = {}) {
  if (!currentTitle) return;
  const values = parseTitle(currentTitle);

  await revealPresentation(values, options);
}

export async function setTitle(title: string, options: SetTitleOptions = {}) {
  const values = parseTitle(title);
  let presented = false;

  const newCategory = (values.category ?? "").toLocaleLowerCase();

  if (!options.skipTransition && newCategory !== currentCategory) {
    presented = await revealPresentation(values, options);
  }

  const $heading = document.getElementById("heading");
  const $category = document.getElementById("category");
  const $title = document.getElementById("title");
  const $subtitle = document.getElementById("subtitle");

  currentCategory = newCategory;
  currentTitle = title;

  if (options.skipTransition) {
    if ($category) $category.innerHTML = titleCase(values.category ?? "");
    if ($title) $title.innerHTML = highlightMentions(values.title) ?? "";
    if ($subtitle) $subtitle.innerHTML = values.subtitle ?? "";

    if (values.subtitle) {
      $heading?.classList.add("--withSubtitle");
    } else {
      $heading?.classList.remove("--withSubtitle");
    }

    const colorscheme = matchColorScheme(values.category);

    setColorscheme(colorscheme);

    return;
  }

  if (!presented) {
    if ($category && $category.innerHTML !== (values.category ?? "")) {
      $heading?.classList.add("--hidingCategory");
    }

    if (
      ($title && $title.innerHTML !== (values.title ?? "")) ||
      ($subtitle && $subtitle.innerHTML !== (values.subtitle ?? ""))
    ) {
      $heading?.classList.add("--hidingTitle");
    }
  }

  setTimeout(
    () => {
      if ($category) $category.innerHTML = titleCase(values.category ?? "");
      if ($title) $title.innerHTML = highlightMentions(values.title) ?? "";
      if ($subtitle) $subtitle.innerHTML = values.subtitle ?? "";

      if (values.subtitle) {
        $heading?.classList.add("--withSubtitle");
      } else {
        $heading?.classList.remove("--withSubtitle");
      }

      const colorscheme = matchColorScheme(values.category);

      setColorscheme(colorscheme);

      $heading?.classList.remove("--hidingCategory");
      $heading?.classList.remove("--hidingTitle");
    },
    presented ? 0 : 750
  );
}

export function setGuests(guests: Guest[] | null) {
  const $broadcaster = document.getElementById("broadcaster");
  if (!$broadcaster) return;

  if (guests && guests.length) {
    const $guests = document.getElementById("guests");
    const $templateGuest = document.getElementById(
      "guestTemplate"
    ) as HTMLTemplateElement | null;

    if (!$templateGuest || !$guests) return;

    $guests.textContent = "";

    const guestSlice =
      guests.length > GUEST_MAX_COUNT
        ? [
            ...guests.slice(0, GUEST_MAX_COUNT - 2),
            `+${guests.length - GUEST_MAX_COUNT + 2}`,
          ]
        : guests;

    guestSlice.forEach((guest: Guest | string) => {
      const $guest = document.importNode($templateGuest.content, true);
      const $guestName = $guest.querySelector(".guestName") as HTMLDivElement;
      const $guestAvatar = $guest.querySelector(
        ".guestAvatar"
      ) as HTMLDivElement;
      const $guestProfilePicture = $guest.querySelector(
        ".guestProfilePicture"
      ) as HTMLImageElement;

      if (typeof guest === "string") {
        if ($guestAvatar) $guestAvatar.textContent = guest;
      } else {
        if ($guestName) $guestName.textContent = guest.displayName;
        if ($guestProfilePicture)
          $guestProfilePicture.src = guest.profilePictureUrl;

        const now = Date.now();
        $guestProfilePicture.addEventListener("load", () => {
          if (Date.now() - now <= 250) {
            $guestAvatar.classList.add("--fast");
          }
          $guestAvatar.classList.add("--loaded");
        });
      }

      $guests.appendChild($guest);
    });

    if (guestSlice.length > 3) {
      $guests.classList.add("--hideNames");
    } else {
      $guests.classList.remove("--hideNames");
    }

    $broadcaster.classList.add("--withGuests");
    $broadcaster.classList.add("--withGuests");
  } else {
    $broadcaster.classList.remove("--withGuests");
  }
}

export function setSocials(social: SocialInfo) {
  const $socials = document.getElementById("socials");
  const $title = document.getElementById("socialTitle");
  const $description = document.getElementById("socialDescription");
  const $link = document.getElementById("socialLink");
  const $icon = document.getElementById("socialIcon");

  $socials?.classList.add("--hiding");

  setTimeout(() => {
    if ($title) $title.innerHTML = social.title ?? "";
    if ($description) $description.innerHTML = social.description ?? "";
    if ($link) $link.innerHTML = social.url ?? "";
    if ($icon) $icon.innerHTML = `<img src="../assets/${social.icon}" />`;

    $socials?.classList.remove("--hiding");
    $socials?.style.setProperty("--socialColor", social.color);
    $socials?.style.setProperty(
      "--linkColor",
      social.linkColor ?? social.color
    );
  }, 750);
}

export function rotateSocials() {
  socialsIndex = (socialsIndex + 1) % socials.length;

  setSocials(socials[socialsIndex]);
}

export function refreshDateTime() {
  const now = new Date();

  const tileElement = document.getElementById("datetime");
  if (!tileElement) return;

  const $time = document.getElementById("time");
  const $timeDay = document.getElementById("timeDay");
  const $timeMonth = document.getElementById("timeMonth");

  if ($time)
    $time.innerHTML =
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0");
  if ($timeDay) $timeDay.innerHTML = now.getDate().toString();
  if ($timeMonth)
    $timeMonth.innerHTML = MONTHS[now.getMonth() as keyof typeof MONTHS];

  tileElement.classList.remove("--none");
}

export function setTileValue(id: string, newValue: string | null) {
  const tileElement = document.getElementById(id);
  if (!tileElement) return;

  const valueElement = tileElement.querySelector(".tile-value");
  if (!valueElement) return;

  if (newValue === null) {
    tileElement.classList.add("--none");
    valueElement.innerHTML = "0";
    return;
  }

  valueElement.innerHTML = newValue;
  tileElement.classList.remove("--none");
}

export function setTileUserValue(
  id: string,
  newValue: string | null,
  newPrice?: string,
  disableAnimation = false
) {
  const tileElement = document.getElementById(id);
  if (!tileElement) return;

  const valueElement: HTMLDivElement | null =
    tileElement.querySelector(".tile-value");
  if (!valueElement) return;

  const userElement: HTMLDivElement | null =
    tileElement.querySelector(".tile-user");
  if (!userElement) return;

  const priceElement: HTMLDivElement | null =
    tileElement.querySelector(".tile-price");

  const blindTextElement: HTMLDivElement | null =
    tileElement.querySelector(".tile-blindText");
  if (!blindTextElement) return;

  if (newValue === null) {
    tileElement.classList.add("--none");
    return;
  } else if (disableAnimation || tileElement.classList.contains("--none")) {
    userElement.innerHTML = newValue;
    if (priceElement && newPrice) {
      priceElement.innerHTML = newPrice;
    }
    tileElement.classList.remove("--none");
    return;
  }

  const previousWidth = valueElement.getBoundingClientRect();
  valueElement.style.setProperty(
    "--previousWidth",
    Math.max(blindTextElement.scrollWidth + 24, previousWidth.width) + "px"
  );
  valueElement.style.setProperty("--newWidth", "auto");

  tileElement.classList.add("--blinded");

  setTimeout(() => {
    userElement.innerHTML = newValue;
    if (priceElement && newPrice) {
      priceElement.innerHTML = newPrice;
    }
    tileElement.classList.remove("--blinded");
    tileElement.classList.add("--hiding");
    const newWidth = valueElement.getBoundingClientRect();
    valueElement.style.setProperty("--newWidth", newWidth.width + "px");
    tileElement.classList.remove("--hiding");
  }, 3000);
}

function getRandomBackground() {
  const id = Math.floor(Math.random() * BACKGROUND_PIANO_LENGTH)
    .toFixed(0)
    .padStart(BACKGROUND_PIANO_PAD, "0");
  return "../backgrounds/Piano" + id + ".jpg";
}

export function preloadNextPresentationBackground() {
  const $presentationBackground = document.getElementById(
    "presentationBackgroundImage"
  ) as HTMLImageElement;
  $presentationBackground.src = getRandomBackground();
}
