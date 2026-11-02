import { GALLERY_FRAME_RADIUS, gallerySections } from './gallery.js';

const frameStep = (Math.PI * 2) / 16;
const firstFrameAngle = -Math.PI / 2 + frameStep / 2;
const photoPaths = Array.from(
  { length: 16 },
  (_, index) => `/photos/photo-${String(index + 1).padStart(2, '0')}.jpeg`,
);
let frameIndex = 0;
const frameStyles = [
  'hero',
  'portrait',
  'landscape',
  'portrait',
  'portrait',
  'hero',
  'portrait',
  'portrait',
  'portrait',
  'portrait',
  'hero',
  'portrait',
  'landscape',
  'portrait',
  'portrait',
  'hero',
];
const memoryMessages = [
  'Somehow, the world led me to you.',
  'I could have talked with you for hours.',
  'One little moment changed everything.',
  'My favorite story began with us.',
  'Your smile is my favorite view.',
  'I keep this day close to my heart.',
  'The smallest rituals became ours.',
  'Anywhere feels special beside you.',
  'Every new place is better with you.',
  'Even a detour feels right when I am with you.',
  'Ordinary days glow a little brighter with you.',
  'Your laugh is still my favorite sound.',
  'Home is wherever your hand finds mine.',
  'Two years in, still my favorite hello.',
  'You are my favorite place to return to.',
  'Here is to a lifetime of little moments.',
];

export const memories = gallerySections.flatMap((section) =>
  section.memories.map((title) => {
    const angle = firstFrameAngle + frameIndex * frameStep;
    const memory = {
      id: `memory-${String(frameIndex + 1).padStart(2, '0')}`,
      title,
      section: section.title,
      frameStyle: frameStyles[frameIndex],
      date: '',
      image: frameIndex === 9 ? null : photoPaths[frameIndex],
      fitImage: frameIndex === 7,
      keepsake: frameIndex === 9,
      message: memoryMessages[frameIndex],
      position: {
        x: GALLERY_FRAME_RADIUS * Math.cos(angle),
        y: 3.0,
        z: GALLERY_FRAME_RADIUS * Math.sin(angle),
        rotationY: -angle - Math.PI / 2,
      },
    };
    frameIndex += 1;
    return memory;
  }),
);
