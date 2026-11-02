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
];
export const letterStandMessages = [
  {
    title: 'TWO YEARS, STILL US',
    lines: [
      'Two years of finding magic',
      'in the ordinary, and joy',
      'in every day we share.',
      'I would choose you, always.',
    ],
  },
  {
    title: 'MY FAVORITE FOREVER',
    lines: [
      'Your laugh, your hand in mine,',
      'the way you make a place feel',
      'like home. These little things',
      'are everything to me.',
    ],
  },
  {
    title: 'MY PROMISE TO YOU',
    lines: [
      'I will keep choosing you,',
      'keep learning your heart,',
      'and keep making memories',
      'with my favorite person.',
    ],
  },
  {
    title: 'TO OUR NEXT CHAPTER',
    lines: [
      'Two years behind us,',
      'a whole lifetime ahead,',
      'and my hand right here',
      'waiting for yours.',
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
