export const GALLERY_WALL_RADIUS = 22.8;
export const GALLERY_FRAME_RADIUS = 22.45;
export const GALLERY_WALK_RADIUS = 20;
export const GALLERY_CAMERA_RADIUS = GALLERY_WALK_RADIUS;
export const GALLERY_CENTER_KEEP_OUT_RADIUS = 1.65;
export const LETTER_STAND_RADIUS = 5.2;
export const LETTER_STAND_COLLISION_RADIUS = 1.05;
export const PLANTER_POSITIONS = [
  ...Array.from({ length: 8 }, (_, index) => {
    const angle = Math.PI / 8 + index * (Math.PI / 4);
    return {
      x: Math.cos(angle) * 13.8,
      z: Math.sin(angle) * 13.8,
      radius: 0.72,
    };
  }),
  ...Array.from({ length: 4 }, (_, index) => {
    const angle = index * (Math.PI / 2);
    return {
      x: Math.cos(angle) * 3.55,
      z: Math.sin(angle) * 3.55,
      radius: 0.62,
    };
  }),
];
export const letterStandMessages = [
  {
    title: 'A NOTE FOR YOU',
    lines: [
      'In every version of my life,',
      'I would still hope to find you.',
      'Thank you for making ordinary',
      'days feel like our favorite ones.',
    ],
  },
  {
    title: 'THE LITTLE THINGS',
    lines: [
      'Your laugh from the next room.',
      'Our talks that turn into midnight.',
      'The quiet comfort of your hand',
      'finding mine. These are my',
      'favorite kinds of magic.',
    ],
  },
  {
    title: 'MY FAVOURITE PROMISE',
    lines: [
      'To keep choosing you,',
      'to keep learning your heart,',
      'and to make a home together',
      'in every place we go.',
    ],
  },
  {
    title: 'ALWAYS, US',
    lines: [
      'Here is to every chapter',
      'we have written, and all the',
      'beautiful little moments',
      'still waiting for us.',
    ],
  },
];

export const gallerySections = [
  {
    title: 'WHERE IT STARTED',
    memories: [
      'The day we met',
      'Our first conversation',
      'The first little spark',
      'The beginning of us',
    ],
  },
  {
    title: 'OUR LITTLE MOMENTS',
    memories: ['A favorite moment', 'A day to remember', 'One of our little traditions'],
  },
  {
    title: 'ADVENTURES TOGETHER',
    memories: ['A little getaway', 'Somewhere new together', 'Our favorite detour'],
  },
  {
    title: 'THE MEMORIES',
    memories: ['The everyday magic', 'A reason to laugh', 'The way you make me feel at home'],
  },
  {
    title: 'FOREVER US',
    memories: ['Still my favorite person', 'My favorite place is with you', 'A love that feels like home'],
  },
];
