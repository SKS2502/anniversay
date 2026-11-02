const CHORDS = [
  {
    notes: [130.81, 164.81, 196],
    melody: [392, 523.25, 659.25, 523.25],
  },
  {
    notes: [98, 123.47, 146.83],
    melody: [587.33, 493.88, 392, 587.33],
  },
  {
    notes: [110, 130.81, 164.81],
    melody: [659.25, 523.25, 440, 659.25],
  },
  {
    notes: [87.31, 110, 130.81],
    melody: [523.25, 440, 349.23, 523.25],
  },
];

const TEMPO = 86;
const BEAT_DURATION = 60 / TEMPO;
const BAR_DURATION = BEAT_DURATION * 4;
const PHRASE_DURATION = BAR_DURATION * CHORDS.length;

export function createAnniversaryMusic() {
  let audioContext = null;
  let masterGain = null;
  let phraseTimer = null;
  let playing = false;
  let playRequest = 0;

  function scheduleTone(frequency, startTime, duration, volume, waveform) {
    const oscillator = audioContext.createOscillator();
    const envelope = audioContext.createGain();
    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(frequency, startTime);
    envelope.gain.setValueAtTime(0.0001, startTime);
    envelope.gain.exponentialRampToValueAtTime(
      volume,
      startTime + Math.min(0.08, duration * 0.2),
    );
    envelope.gain.setValueAtTime(volume * 0.7, startTime + duration * 0.55);
    envelope.gain.exponentialRampToValueAtTime(
      0.0001,
      startTime + duration,
    );
    oscillator.connect(envelope);
    envelope.connect(masterGain);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.02);
  }

  function schedulePhrase(startTime) {
    if (!playing) return;

    CHORDS.forEach((chord, barIndex) => {
      const barStart = startTime + barIndex * BAR_DURATION;
      chord.notes.forEach((frequency, noteIndex) => {
        scheduleTone(frequency, barStart, BAR_DURATION * 0.92, 0.012, 'sine');
        if (noteIndex === 0) {
          scheduleTone(frequency / 2, barStart, BEAT_DURATION * 1.2, 0.025, 'sine');
        }
      });

      chord.melody.forEach((frequency, noteIndex) => {
        scheduleTone(
          frequency,
          barStart + noteIndex * BEAT_DURATION,
          BEAT_DURATION * 0.78,
          0.075,
          'sine',
        );
      });
    });

    const nextPhrase = startTime + PHRASE_DURATION;
    const delay = Math.max(
      0,
      (nextPhrase - audioContext.currentTime - 0.15) * 1000,
    );
    phraseTimer = window.setTimeout(() => {
      schedulePhrase(Math.max(nextPhrase, audioContext.currentTime + 0.1));
    }, delay);
  }

  async function play() {
    if (!window.AudioContext) {
      throw new Error('This browser does not support background music playback.');
    }
    if (playing) return;

    if (!audioContext) {
      audioContext = new window.AudioContext();
      masterGain = audioContext.createGain();
      masterGain.gain.value = 0.0001;
      masterGain.connect(audioContext.destination);
    }

    const request = ++playRequest;
    await audioContext.resume();
    if (request !== playRequest || playing) return;
    playing = true;
    const now = audioContext.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(Math.max(masterGain.gain.value, 0.0001), now);
    masterGain.gain.linearRampToValueAtTime(0.42, now + 1.2);
    schedulePhrase(now + 0.12);
  }

  function pause() {
    playRequest += 1;
    playing = false;
    if (phraseTimer !== null) window.clearTimeout(phraseTimer);
    phraseTimer = null;
    if (audioContext && masterGain) {
      const now = audioContext.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setTargetAtTime(0.0001, now, 0.06);
    }
  }

  return {
    play,
    pause,
    isPlaying: () => playing,
  };
}
