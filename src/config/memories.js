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
  'landscape',
  'portrait',
  'portrait',
  'hero',
  'portrait',
  'landscape',
  'portrait',
  'portrait',
  'hero',
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
      image: photoPaths[frameIndex],
      message: 'Add your photo and personal message in src/config/memories.js.',
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
