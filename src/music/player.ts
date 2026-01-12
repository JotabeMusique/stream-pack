import { QRCodeJs } from '@qr-platform/qr-code.js';

import './player.css'

/* @ts-ignore */
const jsmediatags = window.jsmediatags;

type JSMediaID3DataStringTag = {
  id: string;
  size: number;
  description: string;
  data: string;
}

type JSMediaID3Tag = {
  type: string;
  version: string;
  major: number;
  revision: number;
  size: number;
  tags: {
    TCOM?: JSMediaID3DataStringTag, // Composer
    TOAL?: JSMediaID3DataStringTag, // Original Album
    TOPE?: JSMediaID3DataStringTag, // Original Artist
    WOAS?: JSMediaID3DataStringTag, // Official audio source webpage
    WOAF?: JSMediaID3DataStringTag, // 	Official audio file webpage
    album: string;
    artist: string;
    comment: {
      language: string;
      text: string;
    },
    genre: string;
    title: string;
    track: string;
    year: string;
    picture: {
      format: string;
      type: string;
      data: Array<number>;
    },
  }
}

let previousSongs: Array<string> = [];

function choose<T extends unknown>(arr: Array<T>) {
  const i = Math.floor(Math.random() * arr.length);
  
  return arr[i];
}

function getDataUrl(format: string, data: Array<number>) {
    let base64String = "";
    for (let i = 0; i < data.length; i++) {
      base64String += String.fromCharCode(data[i]);
    }
    return `data:${format};base64,${btoa(base64String)}`;
}

function chooseNextSong() {
  /* @ts-ignore */
  const playlist = (window.PLAYLIST ?? []) as Array<string>;

  if (!playlist.length) return null;

  if (playlist.length === 1) return playlist[0];

  let unplayed = playlist.filter((p) => playlist.indexOf(p) === -1);
  if (!unplayed.length) {
    const previouslyPlayed = previousSongs[previousSongs.length -1];
    unplayed = playlist.filter((p) => p !== previouslyPlayed);
    previousSongs = [];
  }

  const nextAudio = choose<string>(unplayed);

  previousSongs.push(nextAudio);

  return nextAudio;
}

document.addEventListener('DOMContentLoaded', async () => {
  /* @ts-ignore */

  const $audio = document.getElementById('audio') as HTMLAudioElement;
  const $player = document.getElementById('player') as HTMLDivElement;
  const $cover = document.getElementById('cover') as HTMLDivElement;
  const $qrcode = document.getElementById('qrcode') as HTMLDivElement;
  const $track = document.getElementById('track') as HTMLDivElement;
  const $picture = document.getElementById('picture') as HTMLImageElement;
  const $title = document.getElementById('title') as HTMLDivElement;
  const $album = document.getElementById('album') as HTMLDivElement;
  const $artist = document.getElementById('artist') as HTMLDivElement;
  const $original = document.getElementById('original') as HTMLDivElement;
  const $currentProgress = document.getElementById('currentProgress') as HTMLDivElement;

  function playNext() {
    const nextAudio = chooseNextSong();

    if (!nextAudio) return;

    const absoluteUrl = new URL(nextAudio, document.baseURI);

    jsmediatags.read(absoluteUrl.href,{
      onSuccess: function(tag: JSMediaID3Tag) {
        console.log(tag)
        const timeoutDuration = $audio.src ? 1000 : 0;

        $audio.src = nextAudio;
        $audio.play();

        if (timeoutDuration) {
          $player.classList.add('--updating');
        }

        setTimeout(() => {
          const originalArtist = tag.tags.TOPE?.data || tag.tags.TCOM?.data || '';
          const originalAlbum = tag.tags.TOAL?.data || '';
          const pictureDataUrl = tag.tags.picture ? getDataUrl(tag.tags.picture.format, tag.tags.picture.data) : '';
          const url = tag.tags.WOAS?.data || tag.tags.WOAF?.data || '';

          $currentProgress.style.width = '0';
          $title.textContent = tag.tags.title ?? '';
          $artist.textContent = tag.tags.artist ?? '';
          $original.textContent = [originalAlbum, originalArtist].filter(Boolean).join(' - ') ?? '';
          $album.textContent = tag.tags.album ?? '';

          $qrcode.innerHTML = '';

          if (url) {
            const qrCode = new QRCodeJs({
              data: url,
              margin: 0,
              qrOptions: {
                errorCorrectionLevel: 'L',
              },
              backgroundOptions: {
                round: 0.12,
                color: '#ffffffdd',
              },
              cornersSquareOptions: {
                type: 'square',
                color: 'var(--color-primary, black)' // Pink outpoint corners
              },
              cornersDotOptions: {
                type: 'square',
                color: 'var(--color-primary, black)' // Pink outpoint corners
              },
              dotsOptions: {
                color: 'var(--color-primary, black)',
                type: 'square',
              }
            });
            qrCode.append($qrcode);
          }

          $picture.src = pictureDataUrl || './defaultCover.png';
        

          $player.classList.remove('--updating');

        }, timeoutDuration)

      },
      onError: function(error: Error) {
        console.log('Cannot play audio, go next', error);
        playNext();
      }
    });   
  }

  function togglePlay() {
    if ($audio.paused) {
      $audio.play();
    } else {
      $audio.pause();
    }
  }
  function play() {
    if ($audio.paused) {
      $audio.play();
    }
  }
  
  function pause() {
    $audio.pause();
  }

  function stop() {
    $audio.pause();
    $audio.currentTime = 0;
  }

  function refreshProgress() {
    if(!$player.classList.contains('--updating')) {
      const progress = $audio.duration ? $audio.currentTime / $audio.duration : 0;
      $currentProgress.style.width = progress*100+'%';
    }

    if ($audio.paused) {
      $player.classList.add('--paused');
    } else {
      $player.classList.remove('--paused');
    }
  }

  $audio.addEventListener('ended', () => playNext());
  $audio.addEventListener('error', () => playNext());
  setInterval(refreshProgress, 100);

  $cover?.addEventListener('click', togglePlay);
  $track?.addEventListener('click', playNext);
  playNext();


  window.addEventListener('music:play', function() {
    play();
  });

  window.addEventListener('music:pause', function() {
    pause();
  });
  
  window.addEventListener('music:stop', function() {
    stop();
  });

  window.addEventListener('music:togglePlay', function() {
    togglePlay();
  });
    
  window.addEventListener('music:next', function() {
    playNext();
  });
})