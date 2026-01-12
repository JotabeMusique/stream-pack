import { forceRevealPresentation, preloadNextPresentationBackground, refreshDateTime, rotateSocials, setColorscheme, setGuests, setTileUserValue, setTileValue, setTitle } from './ui';

import './style.css';
import './mock.css';
import { getParams, setParam } from '../settings';

const USERNAMES = [
  // 'This_Username_is_Definitely_Too_Long',
  'la_jarre_a_son',
  'sentinel59',
  'mok_80',
  'hairratic',
];

const GUESTS = [
  { name: 'This_Username_is_Definitely_Too_Long', avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/7db44749-286f-4db0-9c99-574b16170d44-profile_image-150x150.png' },
  { name: 'La_Jarre_a_Son', avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/16f98878-3d6c-4ff1-8dd9-9ce4a9d1f69c-profile_image-150x150.png' },
  { name: 'FibreTigre', avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/fibretigre-profile_image-7a95c9c5424fba41-150x150.jpeg' },
  { name: 'DazJDM', avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/5115fde9-17db-4603-8640-e1bd151f672e-profile_image-150x150.png' },
  { name: 'mistermv', avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/b220f285-b12e-495c-9611-d30a0cbaca0a-profile_image-150x150.png' },
  { name: 'artefr', avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/660e3cef-0f7d-4a77-aff7-6ada065564f2-profile_image-150x150.png' },
  { name: 'lydia__am', avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/74368091-4427-4980-8654-69bf0456f2a5-profile_image-150x150.png' },
  { name: 'Modiiie', avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/b86405b8-4744-4bf6-a891-585ddceaba38-profile_image-150x150.png' },
  { name: 'Tamarabou', avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/c21771d5-a520-430a-9846-6fd600528858-profile_image-150x150.png' },
  { name: 'Clemovitch', avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/6e9217a7-793b-4f96-b204-21bd33b37a07-profile_image-150x150.png' },
  { name: 'LeMwakast', avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/a48be3c4-923b-4c7d-8b47-f567cb035524-profile_image-150x150.png' },
];

const TITLES = [
  '[PROMO 2026] Cours n°1 - Découverte du piano',
  '[PROMO 2025] Cours n°6 - Le Château dans le Ciel - Laputa',
  '[PROMO 2025] Cours n°10 - Kingdom Hearts - Other Promise',
  '[PROMO 2025] Cours n°14 - Celeste - Little Goth',
  '[PROMO 2024] Cours n°30 - Final Fantasy X - To Zanarkand !discord !masterclasse',
  '[PROMO 2024] Cours n°35 - Castlevania - Bloody Tears !discord !masterclasse',
  '[PROMO 2023] Cours n°58 - Asagohan no Uta',
  '[PROMO 2023] Cours n°63 - Shadow of the Colossus - Sunlit Earth',
  '[PROMO 2021] Cours n°109 - Celeste - Prologue (Piano Collections) !discord',
  '[PROMO 2021] Cours n°115 - Chihiro - One Summer\'s Day !discord',
  '[PROMO 2020] Cours n°140 - Asturias !discord !masterclasse',
  '[INTER-PROMOS] Cours n°18, 140 & 272 - Celeste - Prologue !discord !masterclasse',
  '[INTERPROMO] Promos 2021/2023/2024 - Hollow Knight',
  '[MASTERCLASSE] Débrief masterclasse - on fait le résumé de la masterclasse d\'octobre !discord !masterclasse',
  '[DISCUSSION] On parle de la masterclasse !discord !masterclasse',
  '[DISCUSSION] La musique latine - Les rythmes brésiliens !discord !brazil',
  '[DISCUSSION] Musiques Bretonnes - Partagez vos meilleures musiques bretonnes !discord !bzh',
  '[Jour de Play] Débrief - On débriefe la chronique sur Silksong !discord',
  '[THÉORIE] Les signatures rythmiques - 4/4, 3/4, 6/8, ternaire, binaire...',
  '[GAMING] Among Us entre potes !discord',
  '[GAMING] Silksong / Je teste enfin ce jeu !',
  '[GAMING] NieR / Z\'êtes chaud ?',
  '[COMPOSITION] Game of Roles - Musique de caverne', 
  '[COMPOSITION] Game of Roles - Musique de village', 
  '[SOLFÈGE] Introduction à la lecture',
  '[CONCERT] Je vous joue tout mon répertoire',
  '[DÉCOUVERTE] Balancez vos sons: Tapez !request pour que je joue un morceau de votre choix',
  '[POLITIQUE] La gauche - C\'est de l\'autre côté de la droite',
  '[DÉBAT] L\'usage de l\'IA dans l\'art',
  '[PRÉ-LUNDI] On discute avec @dazjdm, @fibretigre et @lemwakast',

  // 'Pas de titre, ni de sujet',
  // 'Titre mot-composé - Sous-titre normal !command',
  // 'Ceci est un titre - Ceci sera le sous-titre',
  // 'Juste un titre avec un mot-clé !command',
  // 'Ce titre est beaucoup trop long mais ce n\'est pas grave car normalement ça devrait passer comme une lettre à la Poste.',
  // '[CATEGORIE BEAUCOUP TROP LONGUE] Titre beaucoup trop long également - sans parler du sous-titre qui n\'a aucune chance ce passer !avecUneCommandeEnPlus',
]

function choose(arr: any[]) {
  const i = Math.floor(Math.random() * arr.length);
  
  return arr[i];
}

function initStats() {
  setTileUserValue('lastFollower', choose(USERNAMES));
  setTileUserValue('lastSubscriber', choose(USERNAMES));
  setTileUserValue('lastDonation', choose(USERNAMES), Math.floor(Math.random() * 100).toFixed(2) + '€');
  setTileValue('viewers', Math.floor(Math.random() * 10000).toString());
  setTitle(choose(TITLES), { skipTransition: true });
}

function refreshUI() {
  const stat = choose(['follow', 'sub', 'donation', 'viewers', 'guests']);


  if (stat === 'follow') {
    setTileUserValue('lastFollower', choose(USERNAMES));
  }
  
  if (stat === 'sub') {
    setTileUserValue('lastSubscriber', choose(USERNAMES));
  }
  
  if (stat === 'donation') {
    setTileUserValue('lastDonation', choose(USERNAMES), Math.floor(Math.random() * 100).toFixed(2) + '€');
  }
  
  if (stat === 'viewers') {
    setTileValue('viewers', Math.floor(Math.random() * 10000).toString());
  }

  if (stat === 'guests') {
    const guestCount = Math.max(0, Math.floor(Math.random() * 12));
    const randomGuests = Array(guestCount).fill(null).map((_, index) => {
      const guest = choose(GUESTS)
      return {
      id: index.toString(),
      name: 'unused',
      displayName: guest.name,
      profilePictureUrl: guest.avatar,
      };
    });
    setGuests(randomGuests);
  }
}

let previousTitle = '';

function changeTitle() {
  const newTitle = choose(TITLES.filter(t => t !== previousTitle));
  setTitle(newTitle, {
    skipTransition: false,
    beforePresentation: obsStopRecording,
    afterPresentation: obsStartRecording
  });
  previousTitle = newTitle;
}

function promptTitle() {
  const title = prompt('Stream Title ?', '[CATÉGORIE] Titre - Description');
  if (title) {
    setTitle(title);
  }
}

function togglePresentation() {
  const $presentation = document.getElementById('presentation') as HTMLDivElement;

  if ($presentation.classList.contains('--show')) {
    $presentation.classList.remove('--show');
  } else {
    $presentation.classList.add('--show');
  }
}

function forcePresentation() {
  forceRevealPresentation({
    forcePresentation: true,
    beforePresentation: obsStopRecording,
    afterPresentation: obsStartRecording
  })
}


function changeMockScene(event: Event) {
  const $overlay = document.getElementById('overlay') as HTMLDivElement;
  const mockScene = (event.target as HTMLSelectElement).value;
  $overlay.className = '';

  $overlay.classList.add('mock');
  $overlay.classList.add('mock-'+mockScene);
}

function obsStopRecording() {
  const params = getParams();

  if (window.obsstudio && params.autoRecording) {
    window.obsstudio.stopRecording();
  }
}

function obsStartRecording() {
  const params = getParams();
  
  if (window.obsstudio && params.autoRecording) {
    window.obsstudio.startRecording();
  }
}

function refreshControlsStates() {
  const params = getParams();
  const $toggleAutoRecordingButton = document.getElementById('toggle_auto_recording') as HTMLButtonElement;

  if (params.autoRecording) {
    $toggleAutoRecordingButton.classList.add('active');
    $toggleAutoRecordingButton.textContent = 'AUTO RECORD: ACTIVE';
  } else {
    $toggleAutoRecordingButton.classList.remove('active');
    $toggleAutoRecordingButton.textContent = 'AUTO RECORD: INACTIVE';
  }
}

function toggleAutoRecording() {
  const params = getParams();

  setParam('autoRecording', !params.autoRecording);

  refreshControlsStates();
}

setColorscheme('default');

document.addEventListener('DOMContentLoaded', () => {
  preloadNextPresentationBackground();
  refreshControlsStates();
  initStats();
  refreshDateTime();
  setInterval(refreshDateTime, 1000);
  setInterval(refreshUI, 4000);
  // setInterval(rotateSocials, 10000);

  const $bgVideo = document.getElementById('background_video') as  HTMLVideoElement | null;
  if ($bgVideo) {
    $bgVideo.addEventListener('ended', () => {
      $bgVideo.currentTime = 0.1;
      $bgVideo.play();
    }, false);
 
    document.addEventListener('click', () => {
      if ($bgVideo.paused) {
        $bgVideo.currentTime = 0.1;
        $bgVideo.play();
      }
    });
  }

  document.getElementById('force_presentation')?.addEventListener('click', forcePresentation);
  document.getElementById('toggle_presentation')?.addEventListener('click', togglePresentation);
  document.getElementById('toggle_auto_recording')?.addEventListener('click', toggleAutoRecording);
  document.getElementById('socials')?.addEventListener('click', rotateSocials);
  document.getElementById('rotate_socials')?.addEventListener('click', rotateSocials);
  document.getElementById('change_title')?.addEventListener('click', changeTitle);
  document.getElementById('set_title')?.addEventListener('click', promptTitle);
  document.getElementById('select_mock_scene')?.addEventListener('change', changeMockScene);

  document.body.classList.add('--ready');
});