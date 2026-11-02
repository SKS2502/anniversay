import './style.css';
import { createAnniversaryMusic } from './audio/anniversaryMusic.js';

const welcome = document.querySelector('#welcome');
const enterButton = document.querySelector('#enter-button');
const enterLabel = enterButton.querySelector('span');
const loadingStatus = document.querySelector('#loading-status');
const musicButton = document.querySelector('#music-button');
const musicIcon = musicButton.querySelector('.music-control__icon');
const backgroundMusic = createAnniversaryMusic();
let loadingExperience = false;
let musicEnabled = true;

function updateMusicButton() {
  const isPlaying = backgroundMusic.isPlaying();
  musicIcon.textContent = isPlaying ? '♫' : musicEnabled ? '♪' : '×';
  const label = isPlaying ? 'Mute background music' : 'Play background music';
  musicButton.setAttribute('aria-label', label);
  musicButton.title = label;
}

function startMusicFromUserGesture() {
  if (!musicEnabled) return;
  backgroundMusic
    .play()
    .then(updateMusicButton)
    .catch((error) => {
      console.error('Unable to play the original anniversary music.', error);
      musicButton.setAttribute('aria-label', 'Background music unavailable');
      musicButton.title = 'Background music could not be played';
    });
  updateMusicButton();
}

async function enterExperience() {
  if (loadingExperience) return;
  startMusicFromUserGesture();
  loadingExperience = true;
  enterButton.disabled = true;
  enterLabel.textContent = 'Opening our world…';
  loadingStatus.hidden = false;
  loadingStatus.textContent = 'Preparing your little world…';

  try {
    const experience = await import('./experience.js');
    experience.startExperience();
  } catch (error) {
    console.error('Unable to start the anniversary experience.', error);
    loadingExperience = false;
    enterButton.disabled = false;
    enterLabel.textContent = 'Enter our world';
    loadingStatus.textContent =
      'The experience could not start. Please refresh and try again.';
    backgroundMusic.pause();
  }
}

musicButton.addEventListener('click', () => {
  musicEnabled = !musicEnabled;
  if (musicEnabled) startMusicFromUserGesture();
  else backgroundMusic.pause();
  updateMusicButton();
});

enterButton.addEventListener('click', enterExperience);
