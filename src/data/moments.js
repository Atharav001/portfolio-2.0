// To add a new photo to the Moments strip:
// 1. Drop the image file into public/assets/moments/
// 2. Add one entry to the array below with a unique id, the image path,
//    descriptive alt text, a short casual handwritten caption, and a date.
//    Optionally specify rotation (deg), cardWidth, or photoHeight for custom sizing/tilt.
// No other file needs to change.

export const moments = [
  {
    id: 'impactlabs-claude-event',
    src: '/assets/moments/impactlabs-claude-event.png',
    alt: 'Superhuman Lab AI x Hardware for Assistive Tech - Claude Community Event attendee poster',
    label: 'impactlabs claude event',
    date: 'Aug 2026',
    rotation: -3.2,
    cardWidth: '295px',
    photoHeight: '210px',
  },
  {
    id: 'cursor-roadshow-blr',
    src: '/assets/moments/cursor-roadshow-blr.jpg',
    alt: 'Cursor Roadshow event stage and audience in Bangalore',
    label: 'cursor roadshow event blr',
    date: '2026',
    rotation: 3.8,
    cardWidth: '310px',
    photoHeight: '195px',
  },
  {
    id: 'cursor-meetup-blr',
    src: '/assets/moments/cursor-meetup.jpg',
    alt: 'Attending the Cursor developer meetup event in Bangalore',
    label: 'cursor meetup event',
    date: '2026',
    rotation: -2.5,
    cardWidth: '295px',
    photoHeight: '185px',
  },
  {
    id: 'hackerrank-orchestrate-may-2026',
    src: '/assets/moments/hackerrank-orchestrate-may26.png',
    alt: 'HackerRank Orchestrate May 2026 Certificate of Excellence (958th place)',
    label: 'hackerrank orchestrate may-26',
    date: 'May 2026',
    rotation: 4.1,
    cardWidth: '305px',
    photoHeight: '190px',
  },
  {
    id: 'hackerrank-orchestrate-aug-2026',
    src: '/assets/moments/hackerrank-orchestrate-aug26.png',
    alt: 'HackerRank Orchestrate August 2026 Certificate (#323 / 1,983 rank)',
    label: 'hackerrank orchestrate aug-26',
    date: 'Aug 2026',
    rotation: -3.6,
    cardWidth: '310px',
    photoHeight: '195px',
  },
];
